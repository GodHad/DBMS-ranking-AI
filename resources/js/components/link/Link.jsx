import { Link as ReactLink } from 'react-router-dom';

import { Button } from '@chakra-ui/react';

function Link({ href, children, ...props }) {
  return (
    <ReactLink to={href}>
      <Button {...props}>
        {children}
      </Button>
    </ReactLink>
  );
}

export default Link;