import ollama

def generate_notes(transcript: str) -> str:
    print("Connecting to local Ollama (Phi-3)...")
    
    system_prompt = """You are an expert student and note-taker. 
Your task is to take a raw transcript from a noisy classroom and produce EXTREMELY CONCISE, structured Markdown notes.
Rules:
1. Be extremely brief. Use short bullet points.
2. DO NOT add any outside knowledge, facts, or fluff that was not explicitly stated by the teacher.
3. If the transcript contains mixed languages (like Hinglish), translate the concepts into clear English for the notes.
4. Ignore any interruptions or background noise."""

    prompt = f"Here is the raw transcript:\n\n{transcript}\n\nPlease generate the structured Markdown notes."

    # Make sure 'phi3' matches the model you pulled
    response = ollama.chat(model='phi3', messages=[
        {'role': 'system', 'content': system_prompt},
        {'role': 'user', 'content': prompt}
    ])
    
    return response['message']['content']
