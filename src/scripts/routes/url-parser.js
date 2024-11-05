function extractUrlSegments(path) {
  const splitUrl = path.split('/');

  return {
    resource: splitUrl[1] || null,
    id: splitUrl[2] || null,
  };
}

function combineUrlSegments(pathSegments) {
  let url = '';

  if (pathSegments.resource) {
    url = url.concat(`/${pathSegments.resource}`);
  }

  if (pathSegments.id) {
    url = url.concat('/:id');
  }

  return url || '/';
}

export function parseAndCombineActiveUrl() {
  const pathname = window.location.hash.slice(1).toLowerCase();
  const urlSegments = extractUrlSegments(pathname);
  return combineUrlSegments(urlSegments);
}
