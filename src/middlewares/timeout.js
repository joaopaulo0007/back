export const timeout = (time) => (req, res, next) => {
    const timeoutId = setTimeout(() => {
        res.status(408).json({ error: 'Timeout da requisição' });
    }, time);

    res.on('finish', () => {
        clearTimeout(timeoutId);
    });

    next();
}; 