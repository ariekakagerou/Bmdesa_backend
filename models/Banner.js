class Banner {
    constructor(data) {
        this.banner_id = data.banner_id;
        this.title = data.title;
        this.image_url = data.image_url;
        this.link_url = data.link_url;
        this.message = data.message;
        this.is_active = data.is_active;
    }

    // Method untuk validasi data banner
    static validate(data) {
        const errors = [];
        
        // Validasi title (required, max 100 chars)
        if (!data.title || data.title.trim() === '') {
            errors.push('Title is required');
        } else if (data.title.length > 100) {
            errors.push('Title must be less than 100 characters');
        }
        
        // Validasi image_url (max 255 chars)
        if (data.image_url && data.image_url.length > 255) {
            errors.push('Image URL must be less than 255 characters');
        }
        
        // Validasi link_url (max 255 chars)
        if (data.link_url && data.link_url.length > 255) {
            errors.push('Link URL must be less than 255 characters');
        }
        
        // Validasi is_active (0 atau 1)
        if (data.is_active !== undefined && ![0, 1].includes(parseInt(data.is_active))) {
            errors.push('is_active must be 0 or 1');
        }
        
        return errors;
    }

    // Method untuk format response JSON
    toJSON() {
        return {
            banner_id: this.banner_id,
            title: this.title,
            image_url: this.image_url,
            link_url: this.link_url,
            message: this.message,
            is_active: this.is_active,
            status: this.is_active === 1 ? 'Active' : 'Inactive',
            created_at: this.created_at,
            updated_at: this.updated_at
        };
    }

    // Method untuk sanitize input
    static sanitize(data) {
        return {
            title: data.title ? data.title.trim() : null,
            image_url: data.image_url || null,
            link_url: data.link_url || null,
            message: data.message || null,
            is_active: data.is_active !== undefined ? parseInt(data.is_active) : 1
        };
    }

    // Method untuk check apakah banner aktif
    isActive() {
        return this.is_active === 1;
    }

    // Method untuk toggle status
    toggleStatus() {
        this.is_active = this.is_active === 1 ? 0 : 1;
        return this.is_active;
    }

    // Method untuk get full image URL
    getFullImageUrl(baseUrl = '') {
        if (!this.image_url) return null;
        
        // Jika sudah full URL, return as is
        if (this.image_url.startsWith('http')) {
            return this.image_url;
        }
        
        // Jika relative path, tambahkan base URL
        return baseUrl + this.image_url;
    }

    // Static method untuk create instance dari database row
    static fromDatabase(row) {
        return new Banner(row);
    }

    // Static method untuk create multiple instances dari database rows
    static fromDatabaseRows(rows) {
        return rows.map(row => new Banner(row));
    }
}

export default Banner;