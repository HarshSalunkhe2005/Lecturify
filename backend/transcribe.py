from faster_whisper import WhisperModel
import os

def transcribe_audio(audio_path: str, model_size: str = "base") -> str:
    print(f"Loading Whisper model '{model_size}'...")
    # Using compute_type="int8" for maximum compatibility on CPU
    model = WhisperModel(model_size, device="cpu", compute_type="int8")
    
    print(f"Transcribing {audio_path}...")
    segments, info = model.transcribe(audio_path, beam_size=5)
    
    print(f"Detected language: '{info.language}' (Probability: {info.language_probability:.2f})")
    
    full_transcript = []
    for segment in segments:
        print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
        full_transcript.append(segment.text)
        
    return " ".join(full_transcript)
