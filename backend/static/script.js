document.addEventListener('DOMContentLoaded', () => {
    const dropZone = document.getElementById('dropZone');
    const audioInput = document.getElementById('audioInput');
    const loadingState = document.getElementById('loadingState');
    const loadingText = document.getElementById('loadingText');
    const notesPlaceholder = document.getElementById('notesPlaceholder');
    const notesContent = document.getElementById('notesContent');
    const rawTranscriptArea = document.getElementById('rawTranscriptArea');
    const transcriptText = document.getElementById('transcriptText');

    // Click to upload
    dropZone.addEventListener('click', () => audioInput.click());

    // Drag and drop events
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.add('dragover'), false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dropZone.addEventListener(eventName, () => dropZone.classList.remove('dragover'), false);
    });

    dropZone.addEventListener('drop', (e) => {
        const file = e.dataTransfer.files[0];
        handleFile(file);
    });

    audioInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        handleFile(file);
    });

    function handleFile(file) {
        if (!file || !file.type.startsWith('audio/')) {
            alert('Please select a valid audio file.');
            return;
        }

        // UI Changes for loading
        dropZone.classList.add('hidden');
        loadingState.classList.remove('hidden');
        rawTranscriptArea.classList.add('hidden');
        notesPlaceholder.classList.remove('hidden');
        notesContent.classList.add('hidden');

        // Cycle loading text to show progress
        let dots = 0;
        const textCycle = setInterval(() => {
            dots = (dots + 1) % 4;
            const dotStr = ".".repeat(dots);
            loadingText.innerText = `Processing AI Pipeline${dotStr}`;
        }, 500);

        // Upload
        const formData = new FormData();
        formData.append('audio', file);

        fetch('/process-audio', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            clearInterval(textCycle);
            loadingState.classList.add('hidden');
            dropZone.classList.remove('hidden');

            if (data.error) {
                alert('Error: ' + data.error);
                return;
            }

            // Show Transcript
            transcriptText.innerText = data.transcript;
            rawTranscriptArea.classList.remove('hidden');

            // Show Notes
            notesPlaceholder.classList.add('hidden');
            notesContent.innerHTML = data.notes_html;
            notesContent.classList.remove('hidden');
        })
        .catch(error => {
            clearInterval(textCycle);
            loadingState.classList.add('hidden');
            dropZone.classList.remove('hidden');
            alert('Network error occurred.');
            console.error(error);
        });
    }
});
