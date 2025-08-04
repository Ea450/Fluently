import Link from "next/link";

const Footer = () => {
  return (
    <section className="bg-black text-white dark:bg-gray-800 dark:text-white p-4 flex justify-between items-center absolute w-full">
      <Link
        target="_blank"
        href="https://islam-pjdc.vercel.app/"
        className="text-blue-400 text-2xl font-bold"
      >
        Eslam
      </Link>
      <p>@ All copyrights reseved</p>
    </section>
  );
};

export default Footer;
