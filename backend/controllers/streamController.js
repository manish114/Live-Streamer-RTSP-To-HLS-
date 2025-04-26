const { startStreamById, stopStreamById } = require('../utils/streamManager');

exports.startStream = (req, res) => {
    const { streamId, rtspUrl } = req.body;
    startStreamById(streamId, rtspUrl);
    res.json({ message: 'Stream started' });
};

exports.stopStream = (req, res) => {
    const { streamId } = req.body;
    stopStreamById(streamId);
    res.json({ message: 'Stream stopped' });
};