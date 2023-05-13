import { Box, Button} from "@chakra-ui/react";

import { useEffect, useRef, useState } from "react";

const PrescriptionViewer = (url) => {

  const iframeRef = useRef(null);

  // useEffect(() => {
  //   iframeRef.current.contentWindow.print();
  // }, []);

  return (
    <Box
      mt={5}
      w='100%'
      position='relative'
    >
      <iframe
        ref={iframeRef}
        src={url}
        style={{ width: '100%', height: '800px' }}
      />
      <Button onClick={handlePrintClick}>Print</Button>
    </Box>
  );
}

export default PrescriptionViewer;