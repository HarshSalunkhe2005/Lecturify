document.addEventListener('DOMContentLoaded', () => {
    const toggleRecordBtn = document.getElementById('toggleRecord');
    const statusBadge = document.querySelector('.status-badge');
    const transcriptContainer = document.getElementById('transcriptContainer');
    let isRecording = true;

    // Simulated incoming transcription lines
    const mockTranscript = [
        "As we increase the temperature, the molecules gain kinetic energy.",
        "This means they move faster and collide with the container walls more frequently.",
        "And remember, according to the ideal gas law, PV = nRT...",
        "If volume is constant, pressure must increase linearly with temperature."
    ];

    let lineIndex = 0;
    let transcriptInterval;

    function addTranscriptLine() {
        if (lineIndex >= mockTranscript.length) {
            clearInterval(transcriptInterval);
            return;
        }

        const p = document.createElement('p');
        p.className = 'transcript-line speaker-teacher';
        p.style.opacity = '0';
        p.style.transform = 'translateY(10px)';
        p.style.transition = 'all 0.5s ease';
        
        // Add text with typing cursor simulation
        p.innerHTML = `"${mockTranscript[lineIndex]}" <span class="typing-indicator"></span>`;
        transcriptContainer.appendChild(p);

        // Animate in
        requestAnimationFrame(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        });

        // Remove cursor from previous line
        const previousLines = document.querySelectorAll('.transcript-line');
        if(previousLines.length > 1) {
            const prevCursor = previousLines[previousLines.length - 2].querySelector('.typing-indicator');
            if(prevCursor) prevCursor.remove();
        }

        // Auto scroll
        transcriptContainer.scrollTop = transcriptContainer.scrollHeight;

        lineIndex++;
    }

    // Toggle recording state
    toggleRecordBtn.addEventListener('click', () => {
        isRecording = !isRecording;
        
        if (isRecording) {
            toggleRecordBtn.innerHTML = '<i class="ri-stop-fill"></i> Stop Session';
            toggleRecordBtn.classList.add('recording');
            toggleRecordBtn.classList.remove('btn-primary');
            toggleRecordBtn.style.background = 'var(--danger)';
            
            statusBadge.innerHTML = '<i class="ri-mic-fill"></i> Actively Listening';
            statusBadge.classList.add('pulse');
            
            transcriptInterval = setInterval(addTranscriptLine, 3000);
        } else {
            toggleRecordBtn.innerHTML = '<i class="ri-play-fill"></i> Resume';
            toggleRecordBtn.classList.remove('recording');
            toggleRecordBtn.classList.add('btn-primary');
            toggleRecordBtn.style.background = 'var(--gradient-accent)';
            
            statusBadge.innerHTML = '<i class="ri-mic-off-fill"></i> Paused';
            statusBadge.classList.remove('pulse');
            
            clearInterval(transcriptInterval);
            
            // Remove active cursor
            const cursor = document.querySelector('.typing-indicator');
            if(cursor) cursor.remove();
        }
    });

    // Start simulation
    transcriptInterval = setInterval(addTranscriptLine, 3000);
});
