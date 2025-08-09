export default function(allowedRoles = []) {
    return (req, res, next) => {
        // Memastikan req.user ada dan memiliki role
        const userRole = req.user && req.user.role;

        // Jika tidak ada role atau role tidak ada dalam allowedRoles, akses ditolak
        if (!userRole || !allowedRoles.includes(userRole)) {
            return res.status(403).json({ message: 'Akses ditolak: Tidak memiliki izin' });
        }

        // Jika role valid, lanjutkan ke middleware berikutnya
        next();
    };
}