import React from 'react';
import {Route, Link } from "react-router-dom";
import routes from '../routes';

const findRouteName = url => routes[url];

const getPaths = (pathname) => {
  const paths = ['/'];

  if (pathname === '/') return paths;

  pathname.split('/').reduce((prev, curr, index) => {
    const currPath = `${prev}/${curr}`;
    paths.push(currPath);
    return currPath;
  });
  console.log(paths);
  return paths;
};

const BreadcrumbsItem = ({match}) => {
  const routeName = findRouteName(match.url);
  if (routeName) {
    return (
      match.isExact ?
        (
          <li className="breadcrumb-item">{routeName}</li>
        ) :
        (
          <li className="breadcrumb-item">
            <Link to={match.url || ''}>
              {routeName}
            </Link>
          </li>
        )
    );
  }
  return null;
};

const Breadcrumbs = ({location : {pathname}, match}) => {
  const paths = getPaths(pathname);
  // const i = 0;
  const items = paths.map((path, i) => <Route key={i++} path={path} component={BreadcrumbsItem}/>);
  return (
    <ul className="breadcrumb mt-3">
      {items}
    </ul>
  );
};

export default props => (
  <div>
    {/* <Route path="/:path" component={Breadcrumbs} {...props} /> */}
  </div>
);
