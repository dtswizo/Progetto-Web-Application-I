import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

const CaptionsList = ({ captions }) => {
  return (
    <ListGroup className="captions-list">
      {captions.map((caption, index) => (
        <ListGroup.Item key={index} className="text-center">
          <Button variant="link" className="caption-button">
            {caption}
          </Button>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CaptionsList;