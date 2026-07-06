import os
import sys
from transcribe import transcribe_audio
from synthesize import generate_notes

def main():
    if len(sys.argv) < 2:
        print("Usage: python main.py <path_to_audio_file>")
        return
        
    audio_file = sys.argv[1]
    
    if not os.path.exists(audio_file):
        print(f"Error: File '{audio_file}' not found.")
        return
        
    print(f"--- Step 1: Transcribing audio from {audio_file} ---")
    raw_transcript = transcribe_audio(audio_file, model_size="base")
    
    print("\n--- Step 2: Synthesizing notes with Phi-3 ---")
    notes = generate_notes(raw_transcript)
    
    output_file = "Processed_Notes.md"
    with open(output_file, "w", encoding="utf-8") as f:
        f.write(notes)
        
    print(f"\nSuccess! Notes have been saved to {output_file}")

if __name__ == "__main__":
    main()
