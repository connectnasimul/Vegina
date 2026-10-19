import React from 'react';

function ErrorPage({ statusCode }: { statusCode?: number }) {
  return (
    <div style={{ textAlign: 'center', padding: '50px', fontFamily: 'sans-serif' }}>
      <h1>{statusCode ? `Error ${statusCode}` : 'An Error Occurred'}</h1>
      <p>Something went wrong. Please return to the homepage.</p>
    </div>
  );
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;
