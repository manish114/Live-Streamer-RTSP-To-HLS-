const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const processes = {}; // Store both ffmpeg process and manual stop flag

function startStreamById(streamId, rtspUrl, retries = 5) {
    const outputDir = path.resolve(__dirname, `../streams/${streamId}`);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    function startFFmpeg() {
        console.log(`Starting stream ${streamId}`);
        const ffmpeg = spawn('ffmpeg', [
            '-rtsp_transport', 'tcp',
            '-i', rtspUrl,
            '-c:v', 'copy',
            '-f', 'hls',
            '-hls_time', '4',
            '-hls_list_size', '5',
            '-hls_flags', 'delete_segments',
            `backend/streams/${streamId}/index.m3u8`
        ]);

        processes[streamId] = {
            ffmpegProcess: ffmpeg,
            manuallyStopped: false,   // Track if it was manually stopped
            rtspUrl,                  // Save URL for reconnect if needed
            retries
        };

        ffmpeg.stderr.on('data', data => console.log(`[FFmpeg ${streamId}] ${data}`));

        ffmpeg.on('close', code => {
            console.log(`[FFmpeg ${streamId}] Process exited with code ${code}`);

            // If manually stopped, do not retry
            if (processes[streamId] && processes[streamId].manuallyStopped) {
                console.log(`[FFmpeg ${streamId}] Stream manually stopped. No reconnect.`);
                delete processes[streamId];
                return;
            }

            // Retry if allowed
            if (processes[streamId] && processes[streamId].retries > 0) {
                console.log(`[FFmpeg ${streamId}] Retrying stream in 5 seconds...`);
                setTimeout(() => {
                    startStreamById(streamId, processes[streamId].rtspUrl, processes[streamId].retries - 1);
                }, 5000);
            } else {
                console.log(`[FFmpeg ${streamId}] No retries left. Giving up.`);
                delete processes[streamId];
            }
        });
    }

    startFFmpeg();
}

function stopStreamById(streamId) {
    const procData = processes[streamId];
    if (procData && procData.ffmpegProcess) {
        console.log(`[FFmpeg ${streamId}] Stopping stream manually.`);
        procData.manuallyStopped = true; // Mark as manually stopped
        procData.ffmpegProcess.kill('SIGINT'); // Send kill signal
    }
}

module.exports = { startStreamById, stopStreamById };
