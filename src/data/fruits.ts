import { FruitItem } from '../types';
import heroFruitFriendsImg from '../assets/images/hero_fruit_friends_1794551966882.jpg';
import appleImg from '../assets/images/fruit_apple_1794551966523.jpg';
import bananaImg from '../assets/images/fruit_banana_1794551966855.jpg';
import orangeImg from '../assets/images/fruit_orange_1794551966794.jpg';
import mangoImg from '../assets/images/fruit_mango_1794551966812.jpg';
import grapesImg from '../assets/images/fruit_grapes_1794551967864.jpg';
import watermelonImg from '../assets/images/fruit_watermelon_1794551968007.jpg';
import pineappleImg from '../assets/images/fruit_pineapple_1794551968949.jpg';
import strawberryImg from '../assets/images/fruit_strawberry_1794551969490.jpg';
import papayaImg from '../assets/images/fruit_papaya_1794551969439.jpg';
import avocadoImg from '../assets/images/fruit_avocado_1794551969708.jpg';

export const HERO_IMAGE_PATH = heroFruitFriendsImg;

export const FRUITS: FruitItem[] = [
  {
    id: 'apple',
    english: 'Apple',
    indonesian: 'Apel',
    pronunciation: 'AP-əl',
    sentence: 'It is an apple.',
    image: appleImg,
    accentHex: '#DC2626',
    surfaceTint: 'bg-red-50',
    borderTint: 'border-red-200',
    funFactId: 'Apel berwarna merah cerah, renyah, dan manis!'
  },
  {
    id: 'banana',
    english: 'Banana',
    indonesian: 'Pisang',
    pronunciation: 'bə-NA-nə',
    sentence: 'It is a banana.',
    image: bananaImg,
    accentHex: '#D97706',
    surfaceTint: 'bg-amber-50',
    borderTint: 'border-amber-200',
    funFactId: 'Pisang berwarna kuning dan lembut saat dimakan.'
  },
  {
    id: 'orange',
    english: 'Orange',
    indonesian: 'Jeruk',
    pronunciation: 'OR-inj',
    sentence: 'It is an orange.',
    image: orangeImg,
    accentHex: '#EA580C',
    surfaceTint: 'bg-orange-50',
    borderTint: 'border-orange-200',
    funFactId: 'Jeruk berbentuk bulat dan kaya akan vitamin C.'
  },
  {
    id: 'mango',
    english: 'Mango',
    indonesian: 'Mangga',
    pronunciation: 'MANG-goh',
    sentence: 'It is a mango.',
    image: mangoImg,
    accentHex: '#CA8A04',
    surfaceTint: 'bg-yellow-50',
    borderTint: 'border-yellow-200',
    funFactId: 'Mangga rasanya manis segar dan harum sekali.'
  },
  {
    id: 'grapes',
    english: 'Grapes',
    indonesian: 'Anggur',
    pronunciation: 'GRAYPS',
    sentence: 'They are grapes.',
    image: grapesImg,
    accentHex: '#7C3AED',
    surfaceTint: 'bg-purple-50',
    borderTint: 'border-purple-200',
    funFactId: 'Anggur tumbuh bergerombol seperti bola-bola ungu kecil.'
  },
  {
    id: 'watermelon',
    english: 'Watermelon',
    indonesian: 'Semangka',
    pronunciation: 'WAW-tər-mel-ən',
    sentence: 'It is a watermelon.',
    image: watermelonImg,
    accentHex: '#16A34A',
    surfaceTint: 'bg-emerald-50',
    borderTint: 'border-emerald-200',
    funFactId: 'Semangka kulitnya hijau dan dagingnya merah penuh air!'
  },
  {
    id: 'pineapple',
    english: 'Pineapple',
    indonesian: 'Nanas',
    pronunciation: 'PYN-ap-əl',
    sentence: 'It is a pineapple.',
    image: pineappleImg,
    accentHex: '#D97706',
    surfaceTint: 'bg-amber-50',
    borderTint: 'border-amber-200',
    funFactId: 'Nanas punya mahkota daun hijau di atas kepalanya!'
  },
  {
    id: 'strawberry',
    english: 'Strawberry',
    indonesian: 'Stroberi',
    pronunciation: 'STRAW-ber-ee',
    sentence: 'It is a strawberry.',
    image: strawberryImg,
    accentHex: '#E11D48',
    surfaceTint: 'bg-rose-50',
    borderTint: 'border-rose-200',
    funFactId: 'Stroberi berwarna merah dengan bintik biji kuning di luar.'
  },
  {
    id: 'papaya',
    english: 'Papaya',
    indonesian: 'Pepaya',
    pronunciation: 'pə-PY-ə',
    sentence: 'It is a papaya.',
    image: papayaImg,
    accentHex: '#EA580C',
    surfaceTint: 'bg-orange-50',
    borderTint: 'border-orange-200',
    funFactId: 'Pepaya dagingnya jingga lembut dan berbiji hitam di tengah.'
  },
  {
    id: 'avocado',
    english: 'Avocado',
    indonesian: 'Alpukat',
    pronunciation: 'av-ə-KAH-doh',
    sentence: 'It is an avocado.',
    image: avocadoImg,
    accentHex: '#15803D',
    surfaceTint: 'bg-green-50',
    borderTint: 'border-green-200',
    funFactId: 'Alpukat berwarna hijau lembut dengan satu biji besar di tengah.'
  }
];
