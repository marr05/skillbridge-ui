import json
import re
import pandas as pd
import nltk
from nltk.corpus import stopwords
from collections import Counter
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os

# --- 1. SETUP ---
# Ensure stopword list is downloaded
try:
    stop_words = set(stopwords.words('english'))
except LookupError:
    nltk.download('stopwords')
    stop_words = set(stopwords.words('english'))

# Initialize the VADER sentiment analyzer
analyzer = SentimentIntensityAnalyzer()

# --- 2. CONFIGURATION ---
# CHANGE THIS to the FOLDER containing filtered .txt files
INPUT_FOLDER = r"/Users/maitreya/Documents/NEU/CS 5170 - AI for HCI/Code/SkillBridge/reddit_analysis"

# Define your keyword themes based on your Affinity Map clusters
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

# --- 3. HELPER FUNCTIONS ---
def load_data_from_folder(folder_path):
    """Loads all .txt or .jsonl files from a folder into a list of dictionaries."""
    data = []
    files_to_process = [f for f in os.listdir(folder_path) if f.endswith(('.txt', '.jsonl'))]
    if not files_to_process:
        print(f"No .txt or .jsonl files found in {folder_path}")
        return data, None
        
    print(f"Found {len(files_to_process)} files to process.")
    
    for filename in files_to_process:
        filepath = os.path.join(folder_path, filename)
        print(f"Loading data from {filename}...")
        with open(filepath, 'r', encoding='utf-8') as f:
            for line_number, line in enumerate(f):
                try:
                    post = json.loads(line)
                    text_content = post.get('body', post.get('selftext', ''))
                    title = post.get('title', '')
                    text = (title + ' ' + text_content).lower().strip()
                    if text:
                        data.append({'text': text})
                except json.JSONDecodeError:
                    # print(f"Skipping bad line in {filename} at line {line_number}")
                    continue
    return pd.DataFrame(data)

def categorize_text(text):
    """Tags text with one or more themes based on keywords."""
    found_themes = []
    for theme, keywords in THEMES.items():
        if any(re.search(r'\b' + re.escape(keyword) + r'\b', text) for keyword in keywords):
            found_themes.append(theme)
    return found_themes if found_themes else ['Other']

def clean_text_for_ngrams(text, theme_keywords):
    """Cleans text for N-gram frequency analysis."""
    text = re.sub(r'[^\w\s]', '', text)  # Remove punctuation
    words = text.split()
    # Remove stopwords, BUT keep important theme keywords
    cleaned_words = [
        w for w in words 
        if w not in stop_words or w in theme_keywords
    ]
    return cleaned_words

def run_ngram_analysis(text_series, top_n_unigrams=20, top_n_bigrams=15):
    """Runs and prints N-gram analysis for a given pandas Series of text."""
    if text_series.empty:
        print("  No data found for this query.")
        return

    # Get the theme keywords to preserve them
    theme_keywords = set(kw for kws in THEMES.values() for kw in kws)
    
    # Clean all text and combine into one giant list of words
    all_words = []
    for words_list in text_series.apply(lambda x: clean_text_for_ngrams(x, theme_keywords)):
        all_words.extend(words_list)

    # Unigrams (Single Keywords)
    unigram_counts = Counter(all_words)
    print(f"\n  Top {top_n_unigrams} Most Common Keywords (Unigrams):")
    for word, count in unigram_counts.most_common(top_n_unigrams):
        print(f"    {word}: {count}")

    # Bigrams (Two-word Phrases)
    bigrams = list(nltk.bigrams(all_words))
    bigram_counts = Counter(bigrams)
    print(f"\n  Top {top_n_bigrams} Most Common Phrases (Bigrams):")
    for (w1, w2), count in bigram_counts.most_common(top_n_bigrams):
        print(f"    {w1} {w2}: {count}")

def run_sentiment_analysis(sentiment_series):
    """Runs and prints sentiment analysis for a given pandas Series of sentiment scores."""
    if sentiment_series.empty:
        print("  No data found for this query.")
        return

    print(f"\n  Total posts analyzed: {len(sentiment_series)}")
    print(f"  Average Compound Sentiment: {sentiment_series.mean():.4f}")
    print(f"  Positive Posts (>{'0.05'}): { (sentiment_series > 0.05).sum() }")
    print(f"  Neutral Posts: { ((sentiment_series >= -0.05) & (sentiment_series <= 0.05)).sum() }")
    print(f"  Negative Posts (<{'-0.05'}): { (sentiment_series < -0.05).sum() }")


# --- 4. MAIN EXECUTION ---
def main():
    # --- Step 1: Load All Data ---
    print(f"Loading all files from folder: {INPUT_FOLDER}...")
    df = load_data_from_folder(INPUT_FOLDER)
    if df.empty:
        print("No data loaded. Exiting.")
        return
    print(f"Successfully loaded {len(df)} total posts/comments.")

    # --- Step 2: Pre-process Data (Themes & Sentiment) ---
    print("Pre-processing data (this may take a minute)...")
    
    # Apply themes
    df['themes'] = df['text'].apply(categorize_text)
    
    # Apply sentiment
    df['sentiment'] = df['text'].apply(lambda text: analyzer.polarity_scores(text)['compound'])
    
    # Explode themes for easy filtering
    # This creates a row for each theme a post belongs to
    df_exploded = df.explode('themes')
    print("Pre-processing complete.")

    # --- Step 3: Run Queries ---

    # --- Query 1: Projects ---
    print("\n" + "="*50)
    print("--- Query 1: (Theme: Learning_Styles) AND (Keyword: 'projects') ---")
    print("   Why: Finds what portfolio projects users are discussing.")
    q1_df = df_exploded[
        (df_exploded['themes'] == 'Learning_Styles') & 
        (df_exploded['text'].str.contains('project')) # 'projects' is already a theme keyword
    ]
    print(f"  Found {len(q1_df)} matching posts.")
    run_ngram_analysis(q1_df['text'], top_n_unigrams=15, top_n_bigrams=20)

    # --- Query 2: Free Resources ---
    print("\n" + "="*50)
    print("--- Query 2: (Theme: Learning_Barriers) AND (Keywords: 'free' OR 'youtube' OR 'affordable') ---")
    print("   Why: Finds community-vetted free/affordable learning resources.")
    q2_df = df_exploded[
        (df_exploded['themes'] == 'Learning_Barriers') & 
        (df_exploded['text'].str.contains('free|youtube|affordable'))
    ]
    print(f"  Found {len(q2_df)} matching posts.")
    run_ngram_analysis(q2_df['text'], top_n_unigrams=30, top_n_bigrams=20)

    # --- Query 3: The "Trust Gap" (Paid Platforms) ---
    print("\n" + "="*50)
    print("--- Query 3: (Theme: Learning_Barriers) AND (Keywords: 'coursera' OR 'udemy' OR 'bootcamp') ---")
    print("   Why: Analyzes sentiment and complaints about paid platforms.")
    q3_df = df_exploded[
        (df_exploded['themes'] == 'Learning_Barriers') & 
        (df_exploded['text'].str.contains('coursera|udemy|bootcamp'))
    ]
    print(f"  Found {len(q3_df)} matching posts.")
    run_sentiment_analysis(q3_df['sentiment'])
    run_ngram_analysis(q3_df['text'], top_n_unigrams=15, top_n_bigrams=20)

    # --- Query 4: The "Hurt" (Negative AI Anxiety) ---
    print("\n" + "="*50)
    print("--- Query 4: (Theme: AI_Anxiety) AND (Sentiment: Negative) ---")
    print("   Why: Isolates the 'paralysis' posts to find *who* is most anxious.")
    q4_df = df_exploded[
        (df_exploded['themes'] == 'AI_Anxiety') & 
        (df_exploded['sentiment'] < -0.05)
    ]
    print(f"  Found {len(q4_df)} matching posts (out of {len(df_exploded[df_exploded['themes'] == 'AI_Anxiety'])} total AI posts).")
    run_ngram_analysis(q4_df['text'], top_n_unigrams=20, top_n_bigrams=20)

    # --- Query 5: The "Help" (Positive AI Anxiety) ---
    print("\n" + "="*50)
    print("--- Query 5: (Theme: AI_Anxiety) AND (Sentiment: Positive) ---")
    print("   Why: Isolates the 'proactive' users to see *how* they are adapting.")
    q5_df = df_exploded[
        (df_exploded['themes'] == 'AI_Anxiety') & 
        (df_exploded['sentiment'] > 0.05)
    ]
    print(f"  Found {len(q5_df)} matching posts.")
    run_ngram_analysis(q5_df['text'], top_n_unigrams=20, top_n_bigrams=20)

    # --- Query 6: The "Pathway" (Career Change) ---
    print("\n" + "="*50)
    print("--- Query 6: (Bigram: 'career change') AND (Keywords: 'qa' OR 'data analyst' OR 'software engineer') ---")
    print("   Why: Finds user-generated pathways for your target roles.")
    # Note: We filter the *original* df here, not df_exploded, to avoid duplicates
    q6_df = df[
        (df['text'].str.contains('career change')) &
        (df['text'].str.contains('qa|data analyst|software engineer'))
    ]
    print(f"  Found {len(q6_df)} matching posts.")
    run_ngram_analysis(q6_df['text'], top_n_unigrams=30, top_n_bigrams=20)
    
    # Also print a few sample posts for qualitative review
    print("\n  --- Sample Posts (Query 6) ---")
    if len(q6_df) > 5:
        # Use random_state for reproducible samples
        for text in q6_df['text'].sample(5, random_state=42):
            print(f"    SAMPLE: {text[:500].strip()}...\n    {'-'*20}")
    elif not q6_df.empty:
        for text in q6_df['text']:
            print(f"    SAMPLE: {text[:500].strip()}...\n    {'-'*20}")
    else:
        print("    No sample posts to display.")


if __name__ == "__main__":
    main()