import { NextResponse } from 'next/server';

interface Media {
    type: 'image' | 'video';
    src: string;
    poster?: string;
}

interface Character {
    id: number;
    name: string;
    age: number;
    description: string;
    verified: boolean;
    media: Media[];
    isPremium: boolean;
    profilePath: string;
}

const CHARACTERS: Character[] = [
    {
        id: 1,
        name: 'Claire',
        age: 24,
        description: 'Model, Fitness Enthusiast',
        verified: true,
        media: [
            {
                type: 'video',
                src: 'https://www.w3schools.com/html/mov_bbb.mp4',
                poster: '/claire-party.jpeg',
            },
            { type: 'image', src: '/claire-party.jpeg' },
            { type: 'image', src: '/claire-couch.jpeg' },
            { type: 'image', src: '/claire-rooftop.jpeg' },
            { type: 'image', src: '/claire-black-outfit.jpeg' },
            { type: 'image', src: '/claire-white-top.jpeg' },
        ],
        isPremium: false,
        profilePath: '/character/claire',
    },
    {
        id: 2,
        name: 'Valeria & Camila',
        age: 25,
        description: 'Twin Sisters, Spanish Models',
        verified: true,
        media: [
            {
                type: 'video',
                src: 'https://www.w3schools.com/html/mov_bbb.mp4',
                poster: '/valeria-camila-new.png',
            },
            { type: 'image', src: '/twins-balcony-bikini.webp' },
            { type: 'image', src: '/twins-red-lingerie.webp' },
            { type: 'image', src: '/twins-cheerleaders.webp' },
            { type: 'image', src: '/valeria-camila-new.png' },
            { type: 'image', src: '/modern-art-gallery.png' },
            { type: 'image', src: '/art-exhibition-gallery.png' },
        ],
        isPremium: false,
        profilePath: '/character/valeria-camila',
    },
    {
        id: 3,
        name: 'Jenny',
        age: 23,
        description: 'Student, Music Lover',
        verified: true,
        media: [
            {
                type: 'video',
                src: 'https://www.w3schools.com/html/mov_bbb.mp4',
                poster: '/jennypinky-new-profile.png',
            },
            { type: 'image', src: '/jennypinky-new-profile.png' },
            { type: 'image', src: '/jennypinky-profile.png' },
            { type: 'image', src: '/art-exhibition-gallery.png' },
        ],
        isPremium: true,
        profilePath: '/character/jenny',
    },
    {
        id: 4,
        name: 'Lee',
        age: 27,
        description: 'Curator, Artist, Adventurer',
        verified: true,
        media: [
            {
                type: 'video',
                src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Lee-3qJSnpL6qlUV7BHWDFEUIAQIHAnKHZ.mp4',
                poster: '/lee-pink-dress.webp',
            },
            { type: 'image', src: '/lee-pink-dress.webp' },
            { type: 'image', src: '/lee-black-lace.webp' },
            { type: 'image', src: '/lee-white-lingerie.webp' },
            { type: 'image', src: '/lee-nurse.webp' },
            { type: 'image', src: '/lee-crop-top.webp' },
            { type: 'image', src: '/lee-new-profile.png' },
        ],
        isPremium: true,
        profilePath: '/character/lee',
    },
    {
        id: 5,
        name: 'Hana',
        age: 23,
        description: 'Model, Fitness Enthusiast, Anime Lover',
        verified: true,
        media: [
            {
                type: 'video',
                src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Hana-zZMG1laNVW2gRlxYks48IfZqPMSGyA.mp4',
                poster: '/hana-black-lingerie.webp',
            },
            { type: 'image', src: '/hana-black-lingerie.webp' },
            { type: 'image', src: '/hana-white-dress.webp' },
            { type: 'image', src: '/hana-beach-dress.webp' },
            { type: 'image', src: '/hana-electric-town-hoodie.webp' },
            { type: 'image', src: '/hana-lingerie-couch.webp' },
            { type: 'image', src: '/hana-sports-bra.webp' },
        ],
        isPremium: false,
        profilePath: '/character/hana',
    },
    {
        id: 6,
        name: 'Akari',
        age: 26,
        description: 'Singer, Detective, Mystery Solver',
        verified: true,
        media: [
            {
                type: 'video',
                src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Jenny-31k4zEjCViaMDt8GbFIxkkHccpbWzt.mp4',
                poster: '/jennypinky-new-profile.png',
            },
            { type: 'image', src: '/akari-new-profile.png' },
            { type: 'image', src: '/akari-bedroom.webp' },
            { type: 'image', src: '/akari-nightclub.webp' },
        ],
        isPremium: false,
        profilePath: '/character/akari',
    },
];

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '2', 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
        return NextResponse.json(
            { error: 'Invalid page or limit parameters' },
            { status: 400 }
        );
    }

    // Calculate pagination
    const totalItems = CHARACTERS.length;
    const totalPages = Math.ceil(totalItems / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Check if page is out of bounds
    if (startIndex >= totalItems) {
        return NextResponse.json(
            { error: 'Page number out of range' },
            { status: 404 }
        );
    }

    // Get paginated data
    const paginatedCharacters = CHARACTERS.slice(startIndex, endIndex);

    return NextResponse.json({
        data: paginatedCharacters,
        pagination: {
            currentPage: page,
            totalPages,
            totalItems,
            itemsPerPage: limit,
        },
    });
}