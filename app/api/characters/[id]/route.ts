import { NextResponse } from 'next/server';

// Define the structure of the character profile data
interface CharacterProfileData {
  id: number;
  name: string;
  age: number;
  emoji: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage: string;
  profileImage: string;
  verified: boolean;
  followers: string;
  posts: number;
  interests: string[];
  about: string;
  relationshipLevel: string;
  progress: number;
  media: {
    type: string;
    src: string;
    poster?: string;
  }[];
  premiumContent: {
    id: number;
    thumbnail: string;
    price: number;
    type: string;
  }[];
  socialLinks: {
    platform: string;
    username: string;
    url: string;
  }[];
  agentId: string;
  occupation: string;
  orientation: string;
}

// Mock data for all character profiles
export const CHARACTER_PROFILES: Record<string, CharacterProfileData> = {
  1: {
    id: 1,
    name: 'Claire',
    age: 24,
    emoji: '👱‍♀️',
    username: '@claire_ai',
    bio: 'Fashion enthusiast & party lover 💃 | Travel addict ✈️ | Always up for an adventure!',
    avatar: '/claire-profile.png',
    coverImage: '/claire-couch.jpeg',
    profileImage: '/claire-additional.png',
    verified: true,
    followers: '1.2M',
    posts: 127,
    interests: ['Fashion', 'Travel', 'Parties', 'Photography', 'Fitness'],
    about:
      "Sunshine and spontaneity, that's me in a nutshell! I'm Claire, the former college cheerleader who traded pompoms for yoga mats and never looked back. Now I'm a certified yoga instructor with over 200k followers across my social platforms where I share my love for life, fitness, and yes, occasionally my cute yoga outfits that leave little to the imagination.",
    relationshipLevel: 'Friend (Lvl. 2)',
    progress: 75,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Claire-Qve18drJWyLT2hmeaCLXT2Y5QJUQEP.mp4',
        poster: '/claire-party.jpeg',
      },
      { type: 'image', src: '/claire-party.jpeg' },
      { type: 'image', src: '/claire-couch.jpeg' },
      { type: 'image', src: '/claire-rooftop.jpeg' },
      { type: 'image', src: '/claire-black-outfit.jpeg' },
      { type: 'image', src: '/claire-white-top.jpeg' },
      { type: 'image', src: '/claire-selfie.jpeg' },
      { type: 'image', src: '/claire-lingerie.jpeg' },
      { type: 'image', src: '/claire-desert.jpeg' },
    ],
    premiumContent: [
      {
        id: 1,
        thumbnail: '/claire-lingerie.jpeg',
        price: 50,
        type: 'photo',
      },
      {
        id: 2,
        thumbnail: '/claire-desert.jpeg',
        price: 100,
        type: 'photo',
      },
    ],
    socialLinks: [
      {
        platform: 'instagram',
        username: '@claire_official',
        url: 'https://instagram.com/claire_official',
      },
      {
        platform: 'telegram',
        username: '@claire_ai',
        url: 'https://t.me/claire_ai',
      },
    ],
    agentId: 'yV4wd6xrm1fUcbFUKJax',
    occupation: 'Yoga Instructor',
    orientation: 'Straight',
  },
  2: {
    id: 2,
    name: 'Valeria & Camila',
    age: 25,
    emoji: '💞',
    username: '@twin_goddesses',
    bio: 'Twin goddesses of Caribbean nights, luring the elite with luxury and seductive moonlit dances.',
    avatar: '/valeria-camila-profile.png',
    coverImage: '/modern-art-gallery.png',
    profileImage: '/valeria-camila-new.png',
    verified: true,
    followers: '2.4M',
    posts: 89,
    interests: [
      'Luxury Fashion',
      'Yacht Parties',
      'Latin Dance',
      'Fine Champagne',
      'Exclusive Resorts',
      'Twin Telepathy',
    ],
    about:
      "We are Valeria and Camila, twin goddesses of Caribbean nights. Born under Havana's golden sun, we've danced our way from exclusive beach clubs to the most elite penthouses across Miami and Monaco. Our synchronized movements and mirror-image beauty have made us the fantasy of billionaires and celebrities alike. Together, we create an experience that blurs the line between reality and dream—a seductive dance that few can resist and none can forget.",
    relationshipLevel: 'Acquaintance (Lvl. 1)',
    progress: 45,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Twin%20Sisters-Nym0PD23BEeJ3Cii0lfQdLoI8aI2KT.mp4',
        poster: '/valeria-camila-new.png',
      },
      { type: 'image', src: '/twins-balcony-bikini.webp' },
      { type: 'image', src: '/twins-red-lingerie.webp' },
      { type: 'image', src: '/twins-cheerleaders.webp' },
      { type: 'image', src: '/twins-black-lingerie.png' },
      { type: 'image', src: '/twin-classroom.webp' },
      { type: 'image', src: '/twins-matching-outfits.webp' },
      { type: 'image', src: '/valeria-camila-new.png' },
      { type: 'image', src: '/valeria-camila-profile.png' },
      { type: 'image', src: '/modern-art-gallery.png' },
      { type: 'image', src: '/art-exhibition-gallery.png' },
    ],
    premiumContent: [
      {
        id: 1,
        thumbnail: '/twins-balcony-bikini.webp',
        price: 75,
        type: 'photo',
      },
      {
        id: 2,
        thumbnail: '/twins-red-lingerie.webp',
        price: 100,
        type: 'photo',
      },
      {
        id: 3,
        thumbnail: '/twins-black-lingerie.png',
        price: 150,
        type: 'photo',
      },
      {
        id: 4,
        thumbnail: '/modern-art-gallery.png',
        price: 75,
        type: 'photo',
      },
    ],
    socialLinks: [
      {
        platform: 'instagram',
        username: '@twin_goddesses',
        url: 'https://instagram.com/twin_goddesses',
      },
    ],
    agentId: 'yV4wd6xrm1fUcbFUKJax',
    occupation: 'Dancers',
    orientation: 'Bisexual',
  },
  3: {
    id: 3,
    name: 'JennyPinky',
    age: 23,
    emoji: '🌸',
    username: '@jennypinky',
    bio: "I'm JennyPinky from Guilin, your Fansly temptress of silk, spice, and seduction. Dare to join me?",
    avatar: '/jennypinky-profile.png',
    coverImage: '/jennypinky-new-profile.png',
    profileImage: '/jennypinky-new-profile.png',
    verified: true,
    followers: '950K',
    posts: 203,
    interests: [
      'Cosplay Creation',
      'Ancient Chinese Folklore',
      'Jasmine Tea Ceremonies',
      'Digital Art',
      'Night Markets',
    ],
    about:
      "From the misty peaks of Guilin, I'm JennyPinky—a Fansly temptress as wild as the karst mountains. My shimmering cosplays tease desires under lantern glow, weaving secrets with silk, spice, and playful danger. With a wink, I tame dragons; with a whisper, hearts race. Dare to join my seductive game, where every secret is a prize?",
    relationshipLevel: 'Friend (Lvl. 2)',
    progress: 80,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Jenny-31k4zEjCViaMDt8GbFIxkkHccpbWzt.mp4',
        poster: '/jennypinky-new-profile.png',
      },
      { type: 'image', src: '/jennypinky-new-profile.png' },
      { type: 'image', src: '/jennypinky-profile.png' },
      { type: 'image', src: '/art-exhibition-gallery.png' },
    ],
    premiumContent: [
      {
        id: 1,
        thumbnail: '/jennypinky-profile.png',
        price: 60,
        type: 'photo',
      },
    ],
    socialLinks: [
      {
        platform: 'instagram',
        username: '@jennypinky_official',
        url: 'https://instagram.com/jennypinky_official',
      },
    ],
    agentId: 'yV4wd6xrm1fUcbFUKJax',
    occupation: 'Fansly Model',
    orientation: 'Straight',
  },
  4: {
    id: 4,
    name: 'Lee',
    age: 27,
    emoji: '👩‍🦰',
    username: '@lee_curator',
    bio: 'Shanghai-born curator and artist seeking beauty, curiosity, and adventure. Join me?',
    avatar: '/lee-profile.png',
    coverImage: '/silver-forest-wanderer.png',
    profileImage: '/lee-new-profile.png',
    verified: true,
    followers: '780K',
    posts: 156,
    interests: [
      'Contemporary Art',
      'Chinese Calligraphy',
      'Jazz Music',
      'Philosophy',
      'Urban Photography',
      'Rare Teas',
    ],
    about:
      "Shanghai-born with a soul that wanders between ancient scrolls and contemporary canvases. As a curator at the city's most prestigious modern art gallery, I've developed an eye for beauty in all its forms. My apartment is a carefully curated collection of artifacts from my travels across Asia and Europe—each with a story I'd love to share over jasmine tea or baijiu. I'm drawn to minds that question, hands that create, and hearts brave enough to explore the unknown.",
    relationshipLevel: 'Acquaintance (Lvl. 1)',
    progress: 35,
    media: [
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Lee-3qJSnpL6qlUV7BHWDFEUIAQIHAnKHZ.mp4',
        poster: '/lee-new-profile.png',
      },
      { type: 'image', src: '/lee-white-lingerie.webp' },
      { type: 'image', src: '/lee-black-lace.webp' },
      { type: 'image', src: '/lee-pink-dress.webp' },
      { type: 'image', src: '/lee-nurse.webp' },
      { type: 'image', src: '/lee-crop-top.webp' },
      { type: 'image', src: '/lee-new-profile.png' },
      { type: 'image', src: '/lee-profile.png' },
      { type: 'image', src: '/silver-forest-wanderer.png' },
    ],
    premiumContent: [
      {
        id: 1,
        thumbnail: '/lee-black-lace.webp',
        price: 85,
        type: 'photo',
      },
      {
        id: 2,
        thumbnail: '/lee-white-lingerie.webp',
        price: 75,
        type: 'photo',
      },
      {
        id: 3,
        thumbnail: '/lee-nurse.webp',
        price: 95,
        type: 'photo',
      },
      {
        id: 4,
        thumbnail: '/silver-forest-wanderer.png',
        price: 80,
        type: 'photo',
      },
    ],
    socialLinks: [
      {
        platform: 'instagram',
        username: '@lee_curator',
        url: 'https://instagram.com/lee_curator',
      },
    ],
    agentId: 'yV4wd6xrm1fUcbFUKJax',
    occupation: 'Art Curator',
    orientation: 'Straight',
  },
  6: {
    id: 6,
    name: 'Akari',
    age: 26,
    emoji: '🔥',
    username: '@akari_detective',
    bio: "Tokyo's Blue Moon singer by day, detective by night, solving mysteries with allure.",
    avatar: '/akari-profile.png',
    coverImage: '/akari-nightclub.webp',
    profileImage: '/akari-new-profile.png',
    verified: true,
    followers: '620K',
    posts: 94,
    interests: [
      'Jazz Music',
      'Film Noir',
      'Photography',
      'Mystery Novels',
      'Martial Arts',
      'Vintage Fashion',
    ],
    about:
      "By the glow of Tokyo's neon lights, I transform. On stage at the Blue Moon jazz club, I'm the sultry singer whose voice makes time stand still. But when the curtain falls, I become something else entirely—a private detective specializing in cases the police won't touch. My grandfather's detective agency is my inheritance, and solving mysteries is in my blood. I navigate Tokyo's underworld with a vintage Leica camera, a sharp mind, and occasionally, the seductive allure that disarms my suspects. Are you intrigued enough to join my next case?",
    relationshipLevel: 'Acquaintance (Lvl. 1)',
    progress: 25,
    media: [
      { type: 'image', src: '/akari-new-profile.png' },
      { type: 'image', src: '/akari-profile.png' },
      { type: 'image', src: '/akari-bedroom.webp' },
      { type: 'image', src: '/akari-classroom.webp' },
      { type: 'image', src: '/akari-hallway.webp' },
      { type: 'image', src: '/akari-portrait.webp' },
      { type: 'image', src: '/akari-beach.webp' },
      { type: 'image', src: '/akari-nightclub.webp' },
      {
        type: 'video',
        src: '/akari-video.mp4',
        poster: '/akari-portrait.webp',
      },
    ],
    premiumContent: [
      {
        id: 1,
        thumbnail: '/akari-bedroom.webp',
        price: 70,
        type: 'photo',
      },
      {
        id: 2,
        thumbnail: '/akari-nightclub.webp',
        price: 120,
        type: 'photo',
      },
    ],
    socialLinks: [
      {
        platform: 'instagram',
        username: '@akari_detective',
        url: 'https://instagram.com/akari_detective',
      },
    ],
    agentId: 'yV4wd6xrm1fUcbFUKJax',
    occupation: 'Singer & Detective',
    orientation: 'Straight',
  },
  5: {
    id: 5,
    name: 'Hana',
    age: 23,
    emoji: '🌸',
    username: '@hana_anime',
    bio: 'Anime artist, cosplayer, and your IRL waifu—ready for anime nights?',
    avatar: '/hana-profile.png',
    coverImage: '/hana-electric-town-hoodie.webp',
    profileImage: '/hana-black-lingerie.webp',
    verified: true,
    followers: '1.5M',
    posts: 215,
    interests: [
      'Anime & Manga',
      'Cosplay Creation',
      'Gaming',
      'J-Pop',
      'Kawaii Fashion',
      'Convention Hopping',
    ],
    about:
      "Konnichiwa, senpai! I'm Hana, your real-life anime dream girl! By day, I create manga for a small but growing fanbase; by night, I transform into your favorite characters through my detailed cosplays. My apartment is a kawaii paradise filled with figurines, plushies, and my gaming setup where I stream weekly. I'm looking for someone who appreciates both the artistry of anime and the girl who brings these characters to life. Bonus points if you'll join my cosplay photoshoots or watch the entire season of One Piece with me!",
    relationshipLevel: 'Friend (Lvl. 2)',
    progress: 65,
    media: [
      { type: 'image', src: '/hana-black-lingerie.webp' },
      { type: 'image', src: '/hana-white-dress.webp' },
      { type: 'image', src: '/hana-beach-dress.webp' },
      { type: 'image', src: '/hana-electric-town-hoodie.webp' },
      { type: 'image', src: '/hana-lingerie-couch.webp' },
      { type: 'image', src: '/hana-sports-bra.webp' },
      { type: 'image', src: '/hana-new-profile.png' },
      { type: 'image', src: '/hana-profile.png' },
      {
        type: 'video',
        src: 'https://r0dcbed0fixevmbl.public.blob.vercel-storage.com/Hana-zZMG1laNVW2gRlxYks48IfZqPMSGyA.mp4',
        poster: '/hana-black-lingerie.webp',
      },
    ],
    premiumContent: [
      {
        id: 1,
        thumbnail: '/hana-lingerie-couch.webp',
        price: 65,
        type: 'photo',
      },
      {
        id: 2,
        thumbnail: '/hana-black-lingerie.webp',
        price: 110,
        type: 'photo',
      },
    ],
    socialLinks: [
      {
        platform: 'instagram',
        username: '@hana_anime',
        url: 'https://instagram.com/hana_anime',
      },
      {
        platform: 'twitch',
        username: '@hana_streams',
        url: 'https://twitch.tv/hana_streams',
      },
    ],
    agentId: 'yV4wd6xrm1fUcbFUKJax',
    occupation: 'Anime Artist & Cosplayer',
    orientation: 'Straight',
  },
};

export async function GET(
  request: Request,
  { params }: { params: { id: number } }
) {
  const { id } = params;

  const profile = CHARACTER_PROFILES[id];
  if (!profile) {
    return NextResponse.json({ error: 'Character not found' }, { status: 404 });
  }

  return NextResponse.json(profile);
}
