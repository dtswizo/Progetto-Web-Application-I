import React from 'react';
import { ListGroup, Button } from 'react-bootstrap';

const CaptionsList = ({ rightCaptions, rngCaptions }) => {
  return (
    <div className="captions-list">
      <ListGroup>
        {rightCaptions.map((caption, index) => (
          <ListGroup.Item key={`right-${index}`} className="text-center">
            <Button variant="link" className="caption-button">
              {caption.text}
            </Button>
          </ListGroup.Item>
        ))}
        {rngCaptions.map((caption, index) => (
          <ListGroup.Item key={`rng-${index}`} className="text-center">
            <Button variant="link" className="caption-button">
              {caption.text}
            </Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </div>
  );
};

export default CaptionsList;
