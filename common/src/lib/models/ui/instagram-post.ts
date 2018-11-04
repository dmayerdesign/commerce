export interface InstagramPost {
    id: string
    user: {
        id: string
        full_name: string
        profile_picture: string
        username: string
    }
    images: {
        thumbnail: {
            width: number
            height: number
            url: string
        }
        low_resolution: {
            width: number
            height: number
            url: string
        }
        standard_resolution: {
            width: number
            height: number
            url: string
        }
    }
    created_time: string
    caption: {
        id: string
        text: string
        created_time: string
        from: {
            id: string
            full_name: string
            profile_picture: string
            username: string
        }
    }
    user_has_liked: boolean
    likes: {
        count: number
    }
    tags: string[]
    filter: string
    comments: {
        count: number
    }
    type: string
    link: string
    location: {
        latitude: number
        longitude: number
        name: string
        id: number
    }
    attribution: string
    users_in_photo: string[]
}
