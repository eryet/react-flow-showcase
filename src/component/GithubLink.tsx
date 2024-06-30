const GithubLink = ({ repoLink }) => {
  return (
    <div className='github-link group'>
      <a
        href={repoLink}
        target='_blank'
        rel='noopener noreferrer'
        className='flex items-center space-x-2'
      >
        <img
          src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'
          alt='GitHub Logo'
          className='w-10 h-10 transition-transform duration-300'
        />
        <div className='hidden group-hover:flex items-center space-x-2 transition-opacity duration-300'>
          <img
            src='https://avatars.githubusercontent.com/u/48248414?v=4'
            alt='Eryet Profile Github'
            className='w-10 h-10'
          />
          <span className='text-gray-800 font-bold'>EryetChen</span>
        </div>
      </a>
    </div>
  );
};

export default GithubLink;
