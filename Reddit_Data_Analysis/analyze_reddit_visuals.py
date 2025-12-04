import json
import re
import pandas as pd
import os
import nltk
from nltk.corpus import stopwords
from nltk.util import ngrams
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import matplotlib.pyplot as plt
import seaborn as sns # Recommended for nicer statistical plots
from wordcloud import WordCloud
import numpy as np

# --- 1. SETUP ---
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

stop_words = set(stopwords.words('english'))

# Initialize the VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Define keyword themes based on Affinity Map clusters
THEMES = {
    'AI_Anxiety': [
        'ai', 'automation', 'replaced', 'displaced', 'obsolete', 
        'future-proof', 'job security', 'ai taking my job', 
        'worried about ai', 'outsmart', 'eradicated'
    ],
    'Learning_Barriers': [
        'bootcamp', 'coursera', 'udemy', 'certificate', 'expensive', 
        'cost', 'unstructured', 'outdated', 'low quality', 
        'not worth it', 'free resources', 'unwilling to pay'
    ],
    'Learning_Styles': [
        'project-based', 'hands-on', 'portfolio', 'projects', 
        'video', 'tutorial', 'visual learner', 'learn by doing',
        'step-by-step'
    ],
    'Upskilling_Motivation': [
        'upskill', 'reskill', 'career change', 'career switch', 
        'pivot', 'new skills', 'mid-career', 'learn to code',
        'necessity'
    ]
}

# --- 2. CONFIGURATION ---
INPUT_FOLDER = '/Users/maitreya/Documents/NEU/CS 5170 - AI for HCI/Code/SkillBridge/reddit_analysis' 

def load_data(folder_path):
    """Loads all .txt (JSONL) files from a folder into a list of dictionaries."""
    data = []
    if not os.path.isdir(folder_path):
        print(f"Error: Path is not a valid folder: {folder_path}")
        return data

    print(f"Reading files from folder: {folder_path}")
    for filename in os.listdir(folder_path):
        if filename.endswith(".txt"):
            filepath = os.path.join(folder_path, filename)
            print(f"  -> Loading {filename}...")
            with open(filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        post = json.loads(line)
                        text_content = post.get('body', post.get('selftext', ''))
                        title = post.get('title', '')
                        text = (title + ' ' + text_content).lower().strip()

                        if text:
                            data.append({'text': text})
                    except json.JSONDecodeError:
                        continue
    return data


def clean_text_for_ngrams(text):
    """Cleans text for N-gram frequency analysis."""
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    words = text.split()
    # Remove stopwords, BUT keep important theme keywords
    theme_keywords = set(kw for kws in THEMES.values() for kw in kws)
    cleaned_words = [
        w for w in words 
        if w not in stop_words or w in theme_keywords
    ]
    return cleaned_words

def categorize_text(text):
    """Tags text with one or more themes based on keywords."""
    found_themes = []
    for theme, keywords in THEMES.items():
        if any(re.search(r'\b' + re.escape(keyword) + r'\b', text) for keyword in keywords):
            found_themes.append(theme)
    return found_themes if found_themes else ['Other']

def generate_visualizations(df, df_themes_exploded, all_words):
    """Generates and saves visualizations."""
    print("\n Generating Visualizations: ")
    
    # Set the style
    sns.set_theme(style="whitegrid")

    # 1. Bar Chart: Theme Distribution
    plt.figure(figsize=(10, 6))
    theme_counts = df_themes_exploded['themes'].value_counts()
    sns.barplot(x=theme_counts.index, y=theme_counts.values, palette="viridis")
    plt.title('Distribution of Discussion Themes', fontsize=16)
    plt.xlabel('Theme', fontsize=12)
    plt.ylabel('Number of Posts', fontsize=12)
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.savefig('viz_1_theme_distribution.png')
    print("  -> Saved 'viz_1_theme_distribution.png'")
    
    # 2. Sentiment Boxplot by Theme (Insight: Shows emotional range per topic)
    plt.figure(figsize=(12, 8))
    filtered_sentiment = df_themes_exploded[df_themes_exploded['themes'] != 'Other']
    
    sns.boxplot(x='themes', y='sentiment', data=filtered_sentiment, palette="coolwarm")
    plt.title('Sentiment Distribution by Theme', fontsize=16)
    plt.xlabel('Theme', fontsize=12)
    plt.ylabel('Sentiment Score (-1 to 1)', fontsize=12)
    plt.axhline(0, color='gray', linestyle='--') # Zero line for neutrality
    plt.tight_layout()
    plt.savefig('viz_2_sentiment_boxplot.png')
    print("  -> Saved 'viz_2_sentiment_boxplot.png'")

    # 3. Horizontal Bar Chart: Top 20 Bigrams (Insight: Contextual phrases)
    bigrams = list(ngrams(all_words, 2))
    bigram_counts = Counter(bigrams)
    top_20_bigrams = bigram_counts.most_common(20)
    
    bigram_labels = [f"{w1} {w2}" for (w1, w2), freq in top_20_bigrams]
    bigram_values = [freq for (w1, w2), freq in top_20_bigrams]

    plt.figure(figsize=(12, 10))
    sns.barplot(x=bigram_values, y=bigram_labels, palette="magma")
    plt.title('Top 20 Most Frequent Phrases (Bigrams)', fontsize=16)
    plt.xlabel('Frequency', fontsize=12)
    plt.tight_layout()
    plt.savefig('viz_3_top_phrases.png')
    print("  -> Saved 'viz_3_top_phrases.png'")

    # 4. Word Cloud (Insight: High level overview)
    unigram_counts = Counter(all_words)
    print("  -> Generating Word Cloud...")
    wc = WordCloud(width=1600, height=800, background_color='white', colormap='ocean').generate_from_frequencies(unigram_counts)
    plt.figure(figsize=(15, 7))
    plt.imshow(wc, interpolation='bilinear')
    plt.axis('off')
    plt.title('Word Cloud of Career Discussions', fontsize=16)
    plt.tight_layout()
    plt.savefig('viz_4_wordcloud.png')
    print("  -> Saved 'viz_4_wordcloud.png'")

    # 5. Co-occurrence Heatmap (Insight: How often themes overlap)
    # Filter out 'Other' first
    df_filtered = df[df['themes'].apply(lambda x: 'Other' not in x)]
    
    # Get unique themes list
    unique_themes = list(THEMES.keys())
    matrix = pd.DataFrame(0, index=unique_themes, columns=unique_themes)

    for themes in df_filtered['themes']:
        if len(themes) > 1:
            for i in range(len(themes)):
                for j in range(i + 1, len(themes)):
                    t1, t2 = themes[i], themes[j]
                    if t1 in unique_themes and t2 in unique_themes:
                        matrix.loc[t1, t2] += 1
                        matrix.loc[t2, t1] += 1 # Symmetric

    plt.figure(figsize=(10, 8))
    sns.heatmap(matrix, annot=True, fmt='d', cmap="YlGnBu")
    plt.title('Theme Co-occurrence Heatmap', fontsize=16)
    plt.tight_layout()
    plt.savefig('viz_5_cooccurrence_heatmap.png')
    print("  -> Saved 'viz_5_cooccurrence_heatmap.png'")


def main():
    # --- 3. LOAD & PREPARE DATA ---
    print(f"Loading data from {INPUT_FOLDER}...")
    data = load_data(INPUT_FOLDER)
    if not data:
        print("No data loaded. Please check your INPUT_FILE path and format.")
        return

    df = pd.DataFrame(data)
    print(f"Successfully loaded {len(df)} posts/comments.")

    # --- 4. THEMATIC & SENTIMENT ANALYSIS ---
    print("\n--- Running Analysis ---")
    df['themes'] = df['text'].apply(categorize_text)
    df['sentiment'] = df['text'].apply(lambda text: analyzer.polarity_scores(text)['compound'])
    
    # Explode the 'themes' list so each theme gets its own row for counting/plotting
    df_themes_exploded = df.explode('themes')
    
    # --- 5. PREPARE WORDS ---
    print("  -> Cleaning text for word analysis...")
    all_words = []
    # Using a sample if dataset is massive to speed up dev, remove .sample(n) for full run
    for words_list in df['text'].apply(clean_text_for_ngrams): 
        all_words.extend(words_list)

    # --- 6. GENERATE VISUALIZATIONS ---
    generate_visualizations(df, df_themes_exploded, all_words)
    print("\nAll visualizations generated successfully.")


if __name__ == "__main__":
    main()