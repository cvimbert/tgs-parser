let req: XMLHttpRequest = new XMLHttpRequest();
req.open("GET", "structure.tgs");
req.send();

req.onreadystatechange = () => {
  if (req.readyState === XMLHttpRequest.DONE) {
    if (req.status === 200) {
      console.log(req.responseText);
    }
  }
};
