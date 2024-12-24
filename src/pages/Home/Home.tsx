import CodeBlock from '../../components/CodeBlock/CodeBlock';

export default function HomePage() {
  return (
    <div className='size-xs p-6 overflow-auto'>
      <CodeBlock
        language='typescript'
        code={`
function EF({ onReady }) {
  useEffect(() => {
    console.log("EF useEffect");
    onReady();
  }, [onReady]);
  return <div>EF</div>;
}

function A({ isReady }) {
  useEffect(() => {
    if (isReady) {
      console.log("A useEffect");
    }
  }, [isReady]);
  return <div>A</div>;
}

function B({ isReady }) {
  useEffect(() => {
    if (isReady) {
      console.log("B useEffect");
    }
  }, [isReady]);
  return <div>B</div>;
}

export default function App() {
  const [isReady, setIsReady] = React.useState(false);

  return (
    <>
      <EF onReady={() => setIsReady(true)} />
      <A isReady={isReady} />
      <B isReady={isReady} />
    </>
  );
}
`}
      />

      <div style={{ margin: '20px' }}></div>
    </div>
  );
}
