import os
import markdown
from flask import Flask, request, render_template, jsonify
from werkzeug.utils import secure_filename
from transcribe import transcribe_audio
from synthesize import generate_notes

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/process-audio', methods=['POST'])
def process_audio():
    if 'audio' not in request.files:
        return jsonify({'error': 'No audio file provided'}), 400
        
    file = request.files['audio']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        try:
            # 1. Transcribe (Local Whisper)
            raw_transcript = transcribe_audio(filepath, model_size="base")
            
            # 2. Synthesize (Local Phi-3)
            notes = generate_notes(raw_transcript)
            
            # 3. Convert Markdown to HTML for rendering in the UI
            notes_html = markdown.markdown(notes)
            
            return jsonify({
                'transcript': raw_transcript,
                'notes_html': notes_html,
                'notes_md': notes
            })
            
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            # Cleanup audio file to save space
            if os.path.exists(filepath):
                os.remove(filepath)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
