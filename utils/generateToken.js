import jwt from 'jsonwebtoken'

export const generateTokenSync = (id,role,email) => {
    
    
    try {
        const token= jwt.sign({ id:id ,role:role,email:email}, process.env.JWT_SECRET, { expiresIn: '1h' });
      
        return token
        
        
    } catch (error) {
        console.error("JWT Signing Error:", error);
        return null;
    }
};

export const generateAdminTokenSync = (id) => {
    try {
        const token= jwt.sign({ id:id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        return token
    } catch (error) {
        console.error("JWT Signing Error:", error);
        return null;
    }
};




