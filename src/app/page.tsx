import AlphabetButton from '../../components/AlphabetButton';
import Button from '../../components/Button';


export default function MyApp() {
  return (
    <div>
      <h1>Welcome to my app</h1>
      <Button />
      <App /> {/* 呼び出せば、Appコンポーネントも表示されます */}
      <div>
      <h1>アルファベット</h1>
      <AlphabetButton />
      </div>
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
