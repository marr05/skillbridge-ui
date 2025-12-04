import json
import re
import pandas as pd
import os
import nltk
from nltk.corpus import stopwords
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

# --- 1. SETUP ---
nltk.download('stopwords')
stop_words = set(stopwords.words('english'))

# Initialize the VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# Define keyword themes based on Affinity Map clusters
# These are used to categorize each post
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
        if filename.endswith(".txt"):  # Look for the .txt files from your filter script
            filepath = os.path.join(folder_path, filename)
            print(f"  -> Loading {filename}...")
            with open(filepath, 'r', encoding='utf-8') as f:
                for line in f:
                    try:
                        post = json.loads(line)
                        # Get text: use 'body' for comments, 'selftext' for post text
                        # Or combine title and selftext for posts
                        text_content = post.get('body', post.get('selftext', ''))
                        title = post.get('title', '')

                        # Combine title and body/selftext for a complete picture
                        text = (title + ' ' + text_content).lower().strip()

                        if text:
                            data.append({'text': text})
                    except json.JSONDecodeError:
                        # print(f"Skipping bad line: {line}") # Uncomment for debugging
                        continue
    return data


def clean_text_for_ngrams(text):
    """Cleans text for N-gram frequency analysis."""
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    words = text.split()
    # Remove stopwords, BUT keep our important theme keywords
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
        # Use regex to find whole words
        if any(re.search(r'\b' + re.escape(keyword) + r'\b', text) for keyword in keywords):
            found_themes.append(theme)
    # If no theme is found, categorize as 'Other'
    return found_themes if found_themes else ['Other']

def main():
    # --- 3. LOAD & PREPARE DATA ---
    print(f"Loading data from {INPUT_FOLDER}...")
    data = load_data(INPUT_FOLDER)
    if not data:
        print("No data loaded. Please check your INPUT_FILE path and format.")
        return

    df = pd.DataFrame(data)
    print(f"Successfully loaded {len(df)} posts/comments.")

    # --- 4. THEMATIC ANALYSIS ---
    print("\n--- Thematic Analysis ---")
    df['themes'] = df['text'].apply(categorize_text)
    
    # Explode the 'themes' list so each theme gets its own row for counting
    df_themes_exploded = df.explode('themes')
    
    theme_counts = df_themes_exploded['themes'].value_counts()
    print("Post/Comment Count by Theme:")
    print(theme_counts)

    # --- 5. SENTIMENT ANALYSIS (for AI_Anxiety) ---
    print("\n--- Sentiment Analysis for 'AI_Anxiety' Posts ---")
    
    # Filter for posts that were tagged with 'AI_Anxiety'
    anxiety_df = df_themes_exploded[df_themes_exploded['themes'] == 'AI_Anxiety']
    
    if not anxiety_df.empty:
        sentiments = anxiety_df['text'].apply(
            lambda text: analyzer.polarity_scores(text)['compound']
        )
        
        print(f"Total 'AI_Anxiety' posts analyzed: {len(sentiments)}")
        print(f"Average Compound Sentiment: {sentiments.mean():.4f} (from -1 Negative to +1 Positive)")
        print(f"Positive Posts (>{'0.05'}): { (sentiments > 0.05).sum() }")
        print(f"Neutral Posts: { ((sentiments >= -0.05) & (sentiments <= 0.05)).sum() }")
        print(f"Negative Posts (<{'-0.05'}): { (sentiments < -0.05).sum() }")
    else:
        print("No posts found for the 'AI_Anxiety' theme.")

    # --- 6. KEYWORD & PHRASE FREQUENCY ANALYSIS ---
    print("\n--- Keyword & Phrase Frequency (N-grams) ---")
    
    # Clean all text and combine into one giant list of words
    all_words = []
    for words_list in df['text'].apply(clean_text_for_ngrams):
        all_words.extend(words_list)

    # Unigrams (Single Keywords)
    unigram_counts = Counter(all_words)
    print("\nTop 30 Most Common Keywords (Unigrams):")
    for word, count in unigram_counts.most_common(30):
        print(f"  {word}: {count}")

    # Bigrams (Two-word Phrases)
    bigrams = list(nltk.bigrams(all_words))
    bigram_counts = Counter(bigrams)
    print("\nTop 20 Most Common Phrases (Bigrams):")
    for (w1, w2), count in bigram_counts.most_common(20):
        print(f"  {w1} {w2}: {count}")


if __name__ == "__main__":
    main()
    
    
    