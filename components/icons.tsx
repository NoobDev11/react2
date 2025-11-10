import React from 'react';
import { Icon, IconProps } from '@iconify/react';
import { HabitIcon } from '../types';

// A helper to create icon components to avoid repetition.
const createIcon = (iconName: string) => (props: Omit<IconProps, 'icon'>) => <Icon icon={iconName} {...props} />;

// General UI Icons (using Heroicons 20px Solid for consistency)
export const HomeIcon = createIcon("heroicons:home-20-solid");
export const ClipboardDocumentCheckIcon = createIcon("heroicons:clipboard-document-check-20-solid");
export const ChartBarIcon = createIcon("heroicons:chart-bar-20-solid");
export const Cog6ToothIcon = createIcon("heroicons:cog-6-tooth-20-solid");
export const PlusIcon = createIcon("heroicons:plus-20-solid");
export const XMarkIcon = createIcon("heroicons:x-mark-20-solid");
export const ChevronLeftIcon = createIcon("heroicons:chevron-left-20-solid");
export const ChevronRightIcon = createIcon("heroicons:chevron-right-20-solid");
export const ChevronUpIcon = createIcon("heroicons:chevron-up-20-solid");
export const ChevronDownIcon = createIcon("heroicons:chevron-down-20-solid");
export const BellIcon = createIcon("heroicons:bell-20-solid");
export const ArrowUpOnSquareIcon = createIcon("heroicons:arrow-up-on-square-20-solid");
export const ArrowDownOnSquareIcon = createIcon("heroicons:arrow-down-on-square-20-solid");
export const MoonIcon = createIcon("heroicons:moon-20-solid");
export const InformationCircleIcon = createIcon("heroicons:information-circle-20-solid");
export const ClockIcon = createIcon("heroicons:clock-20-solid");
export const ExclamationTriangleIcon = createIcon("heroicons:exclamation-triangle-20-solid");
export const CheckCircleIcon = createIcon("heroicons:check-circle-20-solid");
export const CheckIcon = createIcon("heroicons:check-20-solid");
export const CheckBadgeIcon = createIcon("heroicons:check-badge-20-solid");
export const FolderIcon = createIcon("heroicons:folder-20-solid");
export const PencilIcon = createIcon("heroicons:pencil-20-solid");
export const TrashIcon = createIcon("heroicons:trash-20-solid");
export const TargetIcon = createIcon("heroicons:bullseye-20-solid");
export const RepeatIcon = createIcon("heroicons:arrow-path-20-solid");
export const FlagIcon = createIcon("heroicons:flag-20-solid");
export const TrophyIcon = createIcon("heroicons:trophy-20-solid");
export const Bars4Icon = createIcon("heroicons:bars-4"); // Outline for drag handle
export const UserCircleIcon = createIcon("heroicons:user-circle-20-solid");
export const CloudArrowUpIcon = createIcon("heroicons:cloud-arrow-up-20-solid");
export const CloudArrowDownIcon = createIcon("heroicons:cloud-arrow-down-20-solid");
export const GoogleIcon = createIcon("flat-color-icons:google");
export const LinkIcon = createIcon("heroicons:link-20-solid");
export const ArrowPathIcon = createIcon("heroicons:arrow-path-20-solid");


// Habit-specific Icons (using Material Design Icons for variety and coverage)
export const RunIcon = createIcon("mdi:run");
export const SpaIcon = createIcon("mdi:spa");
export const BoltIcon = createIcon("mdi:flash");
export const MenuBookIcon = createIcon("mdi:book-open-variant");
export const FitnessIcon = createIcon("mdi:dumbbell");
export const MusicIcon = createIcon("flowbite:music-solid");
export const DrinkIcon = createIcon("material-symbols:water-loss-rounded");
export const BedIcon = createIcon("mdi:bed");
export const SmileIcon = createIcon("mdi:emoticon-happy");
export const WaterDropIcon = createIcon("mdi:water-drop");
export const FlameIcon = createIcon("mdi:fire");
export const BookIcon = createIcon("mdi:book");
export const LightbulbIcon = createIcon("mdi:lightbulb-on");
export const GrassIcon = createIcon("mdi:grass");
export const RupeeIcon = createIcon("mdi:currency-inr");
export const WalkIcon = createIcon("mdi:walk");
export const BookmarkIcon = createIcon("mdi:bookmark");

// Marker Icons (from Material Design Icons)
export const CheckCircleMarkerIcon = createIcon("mdi:check-circle");
export const ArrowUpCircleMarkerIcon = createIcon("mdi:arrow-up-circle");
export const ArrowDownCircleMarkerIcon = createIcon("mdi:arrow-down-circle");
export const BuildCircleMarkerIcon = createIcon("ic:round-build-circle");
export const PauseCircleMarkerIcon = createIcon("mdi:pause-circle");
export const PlayCircleMarkerIcon = createIcon("mdi:play-circle");
export const SwapHorizontalCircleMarkerIcon = createIcon("mdi:swap-horizontal-circle");
export const CloseCircleMarkerIcon = createIcon("mdi:close-circle");
export const StarCircleMarkerIcon = createIcon("mdi:star-circle");
export const StarsMarkerIcon = createIcon("mdi:stars");
export const DiamondMarkerIcon = createIcon("mdi:diamond-stone");
export const GiftMarkerIcon = createIcon("mdi:gift");
export const AtMarkerIcon = createIcon("mingcute:at-fill");
export const BookMultipleMarkerIcon = createIcon("mdi:book-multiple");
export const AnchorMarkerIcon = createIcon("mdi:anchor");
export const AssistantNavigationMarkerIcon = createIcon("material-symbols:assistant-navigation-rounded");
export const AutoAwesomeMarkerIcon = createIcon("tabler:trash-filled");
export const CancelMarkerIcon = createIcon("mdi:cancel");

// Achievement Icons
export const LeafIcon = createIcon("noto:sports-medal");
export const SeedlingIcon = createIcon("noto:fire");
export const FlowerIcon = createIcon("noto:heart-on-fire");
export const SparkleIcon = createIcon("noto:3rd-place-medal");
export const BronzeShieldIcon = createIcon("noto:2nd-place-medal");
export const SilverShieldIcon = createIcon("noto:1st-place-medal");
export const GoldShieldIcon = createIcon("fluent-color:reward-24");
export const GemIcon = createIcon("fxemoji:gem");

export const achievementIconMap: { [key: string]: React.FC<Omit<IconProps, 'icon'>> } = {
  leaf: LeafIcon,
  seedling: SeedlingIcon,
  flower: FlowerIcon,
  sparkle: SparkleIcon,
  bronze: BronzeShieldIcon,
  silver: SilverShieldIcon,
  gold: GoldShieldIcon,
  gem: GemIcon,
};


// Type for marker icon map
type MarkerIconMapType = { [key: string]: React.FC<Omit<IconProps, 'icon'>> };
type MarkerColorMapType = { [key: string]: string };

export const markerIconMap: MarkerIconMapType = {
    'check-circle': CheckCircleMarkerIcon,
    'arrow-up-circle': ArrowUpCircleMarkerIcon,
    'arrow-down-circle': ArrowDownCircleMarkerIcon,
    'build-circle': BuildCircleMarkerIcon,
    'pause-circle': PauseCircleMarkerIcon,
    'play-circle': PlayCircleMarkerIcon,
    'swap-horizontal-circle': SwapHorizontalCircleMarkerIcon,
    'close-circle': CloseCircleMarkerIcon,
    'star-circle': StarCircleMarkerIcon,
    'stars': StarsMarkerIcon,
    'diamond': DiamondMarkerIcon,
    'gift': GiftMarkerIcon,
    'at': AtMarkerIcon,
    'book-multiple': BookMultipleMarkerIcon,
    'anchor': AnchorMarkerIcon,
    'assistant-navigation': AssistantNavigationMarkerIcon,
    'auto-awesome': AutoAwesomeMarkerIcon,
    'cancel': CancelMarkerIcon,
};

export const markerColorMap: MarkerColorMapType = {
    'check-circle': 'emerald-green',
    'arrow-up-circle': 'bright-blue',
    'arrow-down-circle': 'bright-blue',
    'build-circle': 'bright-orange',
    'pause-circle': 'golden-yellow',
    'play-circle': 'emerald-green',
    'swap-horizontal-circle': 'aqua-teal',
    'close-circle': 'vibrant-red',
    'star-circle': 'bright-blue',
    'stars': 'bright-blue',
    'diamond': 'electric-purple',
    'gift': 'bright-orange',
    'at': 'bright-blue',
    'book-multiple': 'emerald-green',
    'anchor': 'sunset-orange',
    'assistant-navigation': 'bright-blue',
    'auto-awesome': 'bright-blue',
    'cancel': 'vibrant-red',
};

// Type for the icon map, compatible with how they are used.
type IconMapType = { [key in HabitIcon]: React.FC<Omit<IconProps, 'icon'>> };

export const iconMap: IconMapType = {
  run: RunIcon,
  spa: SpaIcon,
  bolt: BoltIcon,
  menu_book: MenuBookIcon,
  fitness: FitnessIcon,
  music: MusicIcon,
  drink: DrinkIcon,
  bed: BedIcon,
  trophy: TrophyIcon,
  smile: SmileIcon,
  water_drop: WaterDropIcon,
  flame: FlameIcon,
  book: BookIcon,
  lightbulb: LightbulbIcon,
  grass: GrassIcon,
  rupee: RupeeIcon,
  walk: WalkIcon,
  bookmark: BookmarkIcon,
};