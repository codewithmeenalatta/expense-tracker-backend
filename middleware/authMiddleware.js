import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    // 1. Grab the token from the secure HTTP-only cookie
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: "Access Denied. Please log in." });
    }
    
    try {
        // 2. Verify the token using your secret key
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // 3. Attach the decoded payload (which includes the user's ID) to the request
        req.user = decoded;
        
        // 4. Move on to the controller!
        next();
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired token. Please log in again." });
    }
};