import { PulseLoader } from 'react-spinners';

interface LoaderProps {
  message?: string;
}

const Loader = ({ message = 'Loading notes, please wait...' }: LoaderProps) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '15px',
        padding: '40px 0',
        width: '100%',
      }}>
      <PulseLoader color="#1e56a0" size={15} speedMultiplier={0.8} />
      <p style={{ color: '#666', fontSize: '16px', fontFamily: 'sans-serif' }}>
        {message}
      </p>
    </div>
  );
};

export default Loader;
