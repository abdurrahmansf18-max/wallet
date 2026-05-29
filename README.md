# Expenzo Wallet

Expenzo Wallet, kişisel finans ve dijital cüzdan yönetimi için geliştirilmiş tam yığın bir web uygulamasıdır. Next.js tabanlı arayüz; FastAPI, SQLModel ve PostgreSQL tabanlı bir API ile çalışır.

## Özellikler

- Kullanıcı kayıt, giriş, profil ve avatar yönetimi
- JWT tabanlı kimlik doğrulama
- Cüzdan oluşturma, düzenleme, bakiye takibi ve transfer akışları
- Gelir/gider işlemleri, işlem geçmişi ve kategori takibi
- Bütçeler, finansal hedefler ve fatura yönetimi
- Bildirimler, arama, istatistikler ve rapor ekranları
- Ödeme yöntemleri ve tema/arayüz ayarları

## Teknoloji

- Frontend: Next.js 15, React 18, Tailwind CSS, Radix UI, Recharts, Axios
- Backend: FastAPI, SQLModel, PostgreSQL, Pydantic Settings, JWT
- Dil: JavaScript/JSX ve Python

## Proje Yapısı

```text
wallet/
  backend/   FastAPI uygulaması, API endpointleri, modeller ve veritabanı katmanı
  frontend/  Next.js App Router arayüzü ve UI bileşenleri
```

## Gereksinimler

- Node.js 20+
- Python 3.12+
- PostgreSQL

## Kurulum

Backend:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload
```

Varsayılan API adresi: `http://localhost:8000`

API dokümantasyonu: `http://localhost:8000/docs`

Frontend:

```powershell
cd frontend
npm install
Copy-Item .env.example .env.local
npm run dev
```

Uygulama adresi: `http://localhost:3000`

## Ortam Değişkenleri

Backend `.env`:

- `SECRET_KEY`: JWT imzalama anahtarı. Üretimde güçlü ve gizli bir değer kullanın.
- `DATABASE_URL`: PostgreSQL bağlantı adresi.
- `ACCESS_TOKEN_EXPIRE_MINUTES`: Erişim token süresi.

Frontend `.env.local`:

- `NEXT_PUBLIC_API_URL`: Backend API adresi. Varsayılan: `http://localhost:8000/api/v1`

## Notlar

- `frontend/.env.local`, `.env` dosyaları, build çıktıları ve Python cache dosyaları repoya eklenmez.
- PostgreSQL içinde `DATABASE_URL` değerindeki veritabanının önceden oluşturulmuş olması gerekir.
- Backend ilk açılışta SQLModel tablolarını otomatik oluşturur.
