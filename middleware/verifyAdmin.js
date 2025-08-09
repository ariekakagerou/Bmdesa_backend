const verifyAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden: You are not authorized to access this resource' });
    }
    next(); // lanjutkan ke route handler jika role user adalah admin
};

export default verifyAdmin;