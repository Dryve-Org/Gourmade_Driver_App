import { getCurrentPositionAsync, useForegroundPermissions, PermissionStatus } from 'expo-location'
const GOOGLE_API_KEY = process.env.React_APP_MAP

export const getMapPreview = async (lat: number, lng: number) => {
    const imagePreviewUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=14&size=400x200&maptype=roadmap&markers=color:red%7Clabel:S%7C${lat},${lng}&key=${GOOGLE_API_KEY}`;
    return imagePreviewUrl;
}

export const getLocationHandler = async (callback?: () => void , fallback?: Function) => {
    try {
        const location = await getCurrentPositionAsync()

        if(callback) {
            callback()
        }

        return location
    } catch(e:any) {
        if(fallback) {
            fallback(e)
        }
    }
}