import { Link } from 'react-router-dom';

const Home = () => {
  const moduleGroups = [
    {
      title: 'Basic',
      modules: [
        {
          name: 'Basic Form',
          path: '/basic',
        },
      ],
    },
  ];

  return (
    <div className="w-full">
      <h1 className="text-5xl text-center text-white font-bold">
        Welcome to Another Form Testing App
      </h1>

      <div className="mt-6 grid grid-cols-4 gap-6">
        {moduleGroups.map((group) => {
          return (
            <div key={group.title} className="p-4 bg-dark-1 rounded-lg">
              <h3 className="text-2xl text-white font-semibold">{group.title}</h3>
              <ul className="mt-4 list-disc pl-6">
                {group.modules.map((module) => {
                  return (
                    <li key={module.path} className="w-fit">
                      <Link to={module.path} className="hover:underline">
                        {module.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
