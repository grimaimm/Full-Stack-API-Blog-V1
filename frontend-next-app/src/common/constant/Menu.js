// import {
//   FiHome as HomeIcon,
//   FiUsers as UserIcon,
// } from "react-icons/fi";

// import { MdOutlineCategory as CategoryIconV2 } from "react-icons/md";
// import { AiOutlineComment as CommentIcon } from "react-icons/ai";
// import { RiArticleLine as ArticleIcon } from "react-icons/ri";

// const iconSize = 20;

// export const MENU_ITEMS = [
//   {
//     title: "Home",
//     href: "/dashboard",
//     icon: <HomeIcon size={iconSize} />,
//     isShow: true,
//     eventName: "Pages: Home",
//     type: "Pages",
//   },
//   {
//     title: "Articles",
//     href: "/dashboard/articles",
//     icon: <ArticleIcon size={iconSize} />,
//     isShow: true,
//     eventName: "Pages: Articles",
//     type: "Pages",
//   },
//   {
//     title: "Comments",
//     href: "/dashboard/comments",
//     icon: <CommentIcon size={iconSize} />,
//     isShow: true,
//     eventName: "Pages: Comments",
//     type: "Pages",
//   },
//   {
//     title: "Categories",
//     href: "/dashboard/categories",
//     icon: <CategoryIconV2 size={iconSize} />,
//     isShow: true,
//     eventName: "Pages: Categories",
//     type: "Pages",
//   },
//   {
//     title: "Users",
//     href: "/dashboard/users",
//     icon: <UserIcon size={iconSize} />,
//     isShow: true,
//     eventName: "Pages: Users",
//     type: "Pages",
//   },
// ];

import { FiHome as HomeIcon, FiUsers as UserIcon } from 'react-icons/fi';
import { MdOutlineCategory as CategoryIconV2 } from 'react-icons/md';
import { AiOutlineComment as CommentIcon } from 'react-icons/ai';
import { RiArticleLine as ArticleIcon } from 'react-icons/ri';
import { useSession } from '../context/SessionContext';


const iconSize = 20;

export const MENU_ITEMS = () => {
  const { user } = useSession(); // Ambil data user dari context

  if (!user) {
    return []; // Jika belum login, tidak ada menu yang ditampilkan
  }

  // Menu default yang selalu ditampilkan
  const defaultMenu = [
    {
      title: 'Home',
      href: '/dashboard',
      icon: <HomeIcon size={iconSize} />,
      isShow: true,
      eventName: 'Pages: Home',
      type: 'Pages',
    },
    // {
    //   title: 'Categories',
    //   href: '/dashboard/categories',
    //   icon: <CategoryIconV2 size={iconSize} />,
    //   isShow: true,
    //   eventName: 'Pages: Categories',
    //   type: 'Pages',
    // },
    // {
    //   title: 'Comments',
    //   href: '/dashboard/comments',
    //   icon: <CommentIcon size={iconSize} />,
    //   isShow: true,
    //   eventName: 'Pages: Comments',
    //   type: 'Pages',
    // },
  ];

  // Menu untuk user dengan level_id = 1
  const level1Menu = [
    {
      title: 'Users',
      href: '/dashboard/users',
      icon: <UserIcon size={iconSize} />,
      isShow: true,
      eventName: 'Pages: Users',
      type: 'Pages',
    },
  ];

  // Menu untuk user dengan level_id = 2
  const level2Menu = [
    {
      title: 'Articles',
      href: '/dashboard/articles',
      icon: <ArticleIcon size={iconSize} />,
      isShow: true,
      eventName: 'Pages: Articles',
      type: 'Pages',
    },
  ];

  // Menggabungkan menu berdasarkan level_id pengguna
  return [
    ...defaultMenu,
    ...(user.level_id === 1 ? level1Menu : []),
    ...(user.level_id === 2 ? level2Menu : []),
  ];
};
