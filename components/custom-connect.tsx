'use client';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { FC, CSSProperties } from 'react';

const CustomWalletButton: FC = () => {
  const buttonStyle: CSSProperties = {
  background: 'linear-gradient(90deg, rgba(236,234,255,1) 20%, rgba(222,244,255,1) 80%)',
  color: '#111',
  padding: '10px 20px',
  borderRadius: '12px',
  border: '1px solid rgba(200,200,255,0.5)',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: 900,
  textAlign: 'center',
  display: 'inline-block',
  width: '100%',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  transition: 'all 0.3s ease-in-out',
  backdropFilter: 'blur(6px)',
};

  const hoverStyle: CSSProperties = {
  background: 'linear-gradient(90deg, rgba(225,225,255,0.8), rgba(210,240,255,0.8))',
  color: '#000',
  borderColor: 'rgba(180,180,255,0.6)',
};

  return (
    <ConnectButton.Custom >
      {({
        account,
        chain,
     
        openConnectModal,
        authenticationStatus,
        mounted,
      }) => {
        const ready = mounted && authenticationStatus !== 'loading';
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus ||
            authenticationStatus === 'authenticated');

        return (
          <div
            {...(!ready && {
              'aria-hidden': true,
              style: {
                opacity: 0,
                pointerEvents: 'none',
                userSelect: 'none',
              },
            })}
          >
            {!connected ? (
              // Özelleştirilmiş buton, bağlantı yapılmadığında gösterilir
              <button
                onClick={openConnectModal}
                type="button"
                style={buttonStyle}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, hoverStyle)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, buttonStyle)}
              >
                Connect Wallet
              </button>
            ) : (
              // Bağlantı yapıldıktan sonra varsayılan RainbowKit tasarımı kullanılır
              <ConnectButton chainStatus="icon"  accountStatus={{
                smallScreen: 'avatar',
                largeScreen: 'full',
              }} />
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default CustomWalletButton;