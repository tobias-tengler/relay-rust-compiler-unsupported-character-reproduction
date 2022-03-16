import { graphql, useLazyLoadQuery } from "react-relay";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import styled from "styled-components";

const exampleQuery = graphql`
query AppQuery {
  deviceGraphNodes {
    deviceId
  }
}`

export function App() {
  const data = useLazyLoadQuery(exampleQuery, {})

  return (
    <Container>
      <BrowserRouter>
        <Routes>
          {/* <Route path="/" element={<Dashboard />} /> */}
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

const Container = styled.div`
  max-width: 100vw;
  height: 100%;
`;
