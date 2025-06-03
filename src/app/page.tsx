import Button from '../../components/Button';

export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Button />
      <App /> {/* 呼び出せば、Appコンポーネントも表示されます */}
    </div>
  );
}

export function App() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Button />
    </div>
  );
}
