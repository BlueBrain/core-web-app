import { VirtualLabWithOptionalId } from './types';
import { VirtualLabMember } from '@/types/virtual-lab/members';

export const EMPTY_VIRTUAL_LAB: VirtualLabWithOptionalId = {
  created_at: '',
  name: '',
  description: '',
  reference_email: '',
  budget: 1,
  plan_id: 0,
  users: [],
  include_members: [],
};

export const ROLES: Record<VirtualLabMember['role'], string> = {
  admin: 'Administrator',
  member: 'Member',
};

export const STEPS = ['information', 'plan', 'members'];

export const RX_EMAIL = /^[^ \t@]+@[^ \t@]+$/g;

export const COUNTRIES = [
  "Al-'Iraq العراق",
  "Al-'Urdun الأردن",
  'Al-Yaman اليمن',
  'Al-maɣréb المغرب',
  'Al-‘Arabiyyah as Sa‘ūdiyyah المملكة العربية السعودية',
  'Al-’Imārat Al-‘Arabiyyah Al-Muttaḥidah الإمارات العربيّة المتّحدة',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'As-Sudan السودان',
  'Australia',
  'Azərbaycan',
  'Bangladesh বাংলাদেশ',
  'Barbados',
  'België',
  'Belize',
  'Bharôt ভাৰত',
  'Bielaruś',
  'Bosnia I Hercegovína',
  'Botswana',
  'Brasil',
  'Brunei بروني',
  'Bulgariya',
  'Burkina Faso',
  'Burundi',
  'Bénin',
  'Cabo Verde',
  'Cameroon',
  'Canada',
  'Chile',
  'Chosŏn 조선 Bukchosŏn 북조선',
  'Città del Vaticano',
  'Colombia',
  'Costa Rica',
  'Crna Gora Црна Гора',
  'Cuba',
  "Côte d'Ivoire",
  'Danmark',
  'Dawlat ul-Kuwayt دولة الكويت',
  'Deutschland',
  'Dhivehi Raajje',
  'Druk Yul',
  'Dzayer',
  'Ecuador',
  'Eesti',
  'El Salvador',
  'España',
  'Eswatini',
  'Federated States of Micronesia',
  'Fiji',
  'Filasṭīn فلسطين',
  'France',
  'Gaana',
  'Grenada',
  'Guatemala',
  'Guinea Ecuatorial',
  'Guinée',
  'Guyana',
  'Hanguk 한국 Namhan 남한',
  'Hayastán',
  'Haïti',
  'Hellas Ελλάς',
  'Honduras',
  'Hong Kong',
  'Hrvatska',
  'Indonesia',
  'Ireland',
  'Iritriya إرتريا Ertra ',
  'Israʼiyl إسرائيل',
  'Italia',
  "Ityop'ia ኢትዮጵያ",
  'Jamaica',
  'Kampuchea កម្ពុជា',
  'Kenya',
  'Kosova',
  'Kyrgyzstan Кыргызстан',
  'Lao ປະເທດລາວ',
  'Latvija',
  'Lesotho',
  'Libya',
  'Liechtenstein',
  'Lietuva',
  'Lubnān لبنان',
  'Luxembourg',
  'Madagascar',
  'Magyarország',
  'Malaŵi',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritius',
  'Moldova',
  'Monaca',
  'Mongol Uls Монгол Улс',
  'Moçambique',
  'Mueang Thai',
  'Muritan / Agawec',
  'Myanma မြန်မာ',
  'Mēxihco',
  'Mǎláixīyà 马来西亚',
  'Namibia',
  'Nederland',
  'Nepāl नेपाल',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'Nippon 日本',
  'Norge',
  'O‘zbekiston Ўзбекистон',
  'Palau',
  'Panamá',
  'Papua New Guinea',
  'Paraguái',
  'Philippines',
  'Piruw',
  'Polska',
  'Portugal',
  'Pākistān پاکستان',
  'Qazaqstan Қазақстан',
  'Qaṭar قطر',
  'República Dominicana',
  'România',
  'Rossiâ Россия',
  'Rwanda',
  'République Centrafricaine',
  'République du Congo',
  'République démocratique du Congo',
  'République gabonaise',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  "Sak'art'velo საქართველო",
  'Samoa',
  'San Marino',
  'Severna Makedonija Северна Македонија',
  'Seychelles',
  'Shqipëria',
  'Sierra Leone',
  'Singapore',
  'Slovenija',
  'Slovensko',
  'Solomon Islands',
  'Soomaaliya aş-Şūmāl',
  'South Sudan',
  'Srbija Србија',
  'Sri Lankā ශ්‍රී ලංකාව இலங்கை',
  'Suid-Afrika',
  'Suisse',
  'Suomi',
  'Suriyah سورية',
  'Sverige',
  'São Tomé e Principe',
  'Sénégal',
  'Tanzania',
  'Tchad',
  'The Bahamas',
  'The Gambia',
  'Timor-Lester',
  'Togo',
  'Tojikistan Тоҷикистон',
  'Tonga',
  'Trinidad and Tobago',
  'Tunes',
  'Tuvalu',
  'Türkiye',
  'Uganda',
  'Ukraїna Україна',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Vanuatu',
  'Venezuela',
  'Việt Nam',
  'Wuliwya',
  'Zambia',
  'Zhōngguó 中国',
  'Zimbabwe',
  'Ísland',
  'Österreich',
  'Česko',
  'Īrān ایران',
  'Κύπρος Kıbrıs',
  'افغانستانAfghanestan ',
  'البحرينAl-Bahrayn',
  'جزر القمر Comores Koromi',
  'جيبوتي Djibouti',
  'مصرMisr ',
  '‘Umān عُمان',
];
