const db = require("../config/dbconfig");

const getFeedItems = async (page = 1, limit = 50) => {
    try {
        const offset = (page - 1) * limit;
        
        // Main query to get media items
        console.log('in model');
        const query = `
            SELECT 
                m.media_id,
                u.name AS username,
                m.title,
                m.description,
                m.media_url,
                DATE(m.upload_date) as upload_date,
                m.media_type
            FROM (
                SELECT 
                    p.photo_id AS media_id,
                    p.user_id,
                    p.title,
                    p.description,
                    p.photo_url AS media_url,
                    p.upload_date,
                    'photo' AS media_type
                FROM Photos p

                UNION ALL

                SELECT 
                    v.video_id AS media_id,
                    v.user_id,
                    v.title,
                    v.description,
                    v.video_url AS media_url,
                    v.upload_date,
                    'video' AS media_type
                FROM Videos v
            ) AS m
            JOIN Users u ON m.user_id = u.user_id
            ORDER BY m.upload_date DESC
            LIMIT ? OFFSET ?
        `;

        // Count query for pagination
        const countQuery = `
            SELECT COUNT(*) as total
            FROM (
                SELECT photo_id FROM Photos
                UNION ALL
                SELECT video_id FROM Videos
            ) as combined
        `;

        // Execute both queries in parallel
        const [items, countResult] = await Promise.all([
            db.query(query, [limit, offset]),
            db.query(countQuery)
        ]);

        const totalItems = countResult[0][0].total;
        const totalPages = Math.ceil(totalItems / limit);

        // Group items by date
        const groupedItems = items[0].reduce((acc, item) => {
            const date = item.upload_date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push({
                id: item.media_id,
                media_type: item.media_type,
                title: item.title,
                description: item.description,
                media_url: item.media_url,
                upload_date: item.upload_date,
                user: {
                    name: item.username
                }
            });
            return acc;
        }, {});

        return {
            items: groupedItems,
            pagination: {
                current_page: page,
                total_pages: totalPages,
                total_items: totalItems,
                has_more: page < totalPages
            }
        };
    } catch (error) {
        console.error('Error in getFeedItems:', error);
        throw error;
    }
};

module.exports = {
    getFeedItems
};
