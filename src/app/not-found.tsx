import Image from 'next/image';
import Link from 'next/link';
const NotFoundPage = () => {
  return (
    <>
      <div className="h-screen flex justify-center items-center" id="back-home">
        <div className="w-full md:w-[80%] flex flex-col justify-center items-center">
          <Image
            src={'/not-found.svg'}
            alt={'404 image'}
            width={500}
            height={500}
          />
          <div className="text-center mt-6">
            <h3 className="text-2xl md:text-3xl lg:text-5xl font-bold">
              Sorry we can’t find that page
            </h3>
            <p className="w-full md:w-[80%] xl:w-[70%] 2xl:w-[60%]  mx-auto mt-3 mb-6">
              The website hosting server will typically generate a 404 Not Found
              web page when a user attempts to follow a broken or dead link;
              hence the 404 error is one of the most recognizable errors
              encountered on the World Wide Web.
            </p>

            <Link href={'/'}>
              <button className="text-white bg-primary button-hover-one  rounded-full px-4 py-2">
                Back to Home Page
              </button>
            </Link>
          </div>
        </div>
      </div>
      {/* <Footer/> */}
    </>
  );
};

export default NotFoundPage;
