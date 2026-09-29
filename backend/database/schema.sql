--
-- PostgreSQL database dump
--

\restrict aXv2cB47qZ3ayVfnZZNHYfQIZMbW2cH3ssDBOwBES5HR8jvsNbSew0wlDjmPTbT

-- Dumped from database version 14.24
-- Dumped by pg_dump version 18.4

-- Started on 2026-09-29 14:54:16

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 5 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- TOC entry 2 (class 3079 OID 16384)
-- Name: adminpack; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS adminpack WITH SCHEMA pg_catalog;


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 2
-- Name: EXTENSION adminpack; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION adminpack IS 'administrative functions for PostgreSQL';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 215 (class 1259 OID 16429)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id integer NOT NULL,
    name jsonb NOT NULL,
    description text,
    image text
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 214 (class 1259 OID 16428)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 214
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 235 (class 1259 OID 16613)
-- Name: chat_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.chat_messages (
    id integer NOT NULL,
    user_id integer NOT NULL,
    custom_order_id integer,
    role character varying(20) NOT NULL,
    message text NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chat_messages_role_check CHECK (((role)::text = ANY ((ARRAY['user'::character varying, 'assistant'::character varying])::text[])))
);


ALTER TABLE public.chat_messages OWNER TO postgres;

--
-- TOC entry 234 (class 1259 OID 16612)
-- Name: chat_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.chat_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.chat_messages_id_seq OWNER TO postgres;

--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 234
-- Name: chat_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.chat_messages_id_seq OWNED BY public.chat_messages.id;


--
-- TOC entry 223 (class 1259 OID 16483)
-- Name: custom_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.custom_orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    vendor_id integer,
    furniture_type character varying(100) NOT NULL,
    wood_type character varying(100) NOT NULL,
    size character varying(50) NOT NULL,
    details text,
    estimated_price numeric NOT NULL,
    design_url text,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    ai_analysis jsonb,
    ai_recommendations jsonb
);


ALTER TABLE public.custom_orders OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16482)
-- Name: custom_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.custom_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.custom_orders_id_seq OWNER TO postgres;

--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 222
-- Name: custom_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.custom_orders_id_seq OWNED BY public.custom_orders.id;


--
-- TOC entry 231 (class 1259 OID 16572)
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id integer NOT NULL,
    user_id integer NOT NULL,
    title character varying(255) NOT NULL,
    message text NOT NULL,
    type character varying(50) DEFAULT 'general'::character varying,
    is_read boolean DEFAULT false,
    reference_type character varying(50),
    reference_id integer,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- TOC entry 230 (class 1259 OID 16571)
-- Name: notifications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notifications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.notifications_id_seq OWNER TO postgres;

--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.notifications_id_seq OWNED BY public.notifications.id;


--
-- TOC entry 217 (class 1259 OID 16438)
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id integer NOT NULL,
    user_id integer NOT NULL,
    items jsonb NOT NULL,
    total_amount numeric(12,2) NOT NULL,
    shipping_address text NOT NULL,
    status character varying(30) DEFAULT 'processing'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- TOC entry 216 (class 1259 OID 16437)
-- Name: orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.orders_id_seq OWNER TO postgres;

--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 216
-- Name: orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.orders_id_seq OWNED BY public.orders.id;


--
-- TOC entry 213 (class 1259 OID 16409)
-- Name: products; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.products (
    id integer NOT NULL,
    title jsonb NOT NULL,
    price numeric(12,2) DEFAULT 0 NOT NULL,
    rating numeric(2,1) DEFAULT 0,
    reviews_count integer DEFAULT 0,
    is_customizable boolean DEFAULT false,
    description text,
    dimensions character varying(150),
    material character varying(150),
    images text[] DEFAULT '{}'::text[],
    colors jsonb DEFAULT '[]'::jsonb,
    category_id integer,
    vendor_id integer
);


ALTER TABLE public.products OWNER TO postgres;

--
-- TOC entry 212 (class 1259 OID 16408)
-- Name: products_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.products_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.products_id_seq OWNER TO postgres;

--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 212
-- Name: products_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.products_id_seq OWNED BY public.products.id;


--
-- TOC entry 221 (class 1259 OID 16462)
-- Name: reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.reviews (
    id integer NOT NULL,
    user_id integer NOT NULL,
    product_id integer NOT NULL,
    rating integer NOT NULL,
    comment text,
    image text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_review_rating CHECK (((rating >= 1) AND (rating <= 5)))
);


ALTER TABLE public.reviews OWNER TO postgres;

--
-- TOC entry 220 (class 1259 OID 16461)
-- Name: reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.reviews_id_seq OWNER TO postgres;

--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 220
-- Name: reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reviews_id_seq OWNED BY public.reviews.id;


--
-- TOC entry 219 (class 1259 OID 16449)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    email character varying(255) NOT NULL,
    password text NOT NULL,
    role character varying(30) DEFAULT 'user'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    is_verified boolean DEFAULT false
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 16448)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 211 (class 1259 OID 16395)
-- Name: vendors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.vendors (
    id integer NOT NULL,
    name character varying(150) NOT NULL,
    specialty character varying(150),
    rating numeric(2,1) DEFAULT 0,
    verified boolean DEFAULT false,
    location character varying(150),
    projects_count integer DEFAULT 0,
    experience integer DEFAULT 0,
    image text,
    cover text,
    about text,
    portfolio text[] DEFAULT '{}'::text[],
    latitude numeric,
    longitude numeric,
    user_id integer
);


ALTER TABLE public.vendors OWNER TO postgres;

--
-- TOC entry 210 (class 1259 OID 16394)
-- Name: vendors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.vendors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.vendors_id_seq OWNER TO postgres;

--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 210
-- Name: vendors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.vendors_id_seq OWNED BY public.vendors.id;


--
-- TOC entry 233 (class 1259 OID 16593)
-- Name: verification_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.verification_requests (
    id integer NOT NULL,
    user_id integer NOT NULL,
    official_id_number character varying(100) NOT NULL,
    workshop_name character varying(255) NOT NULL,
    documents_image text,
    payment_status character varying(50) DEFAULT 'pending'::character varying,
    payment_amount numeric(10,2) DEFAULT 50.00,
    status character varying(50) DEFAULT 'pending'::character varying,
    admin_note text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.verification_requests OWNER TO postgres;

--
-- TOC entry 232 (class 1259 OID 16592)
-- Name: verification_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.verification_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.verification_requests_id_seq OWNER TO postgres;

--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 232
-- Name: verification_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.verification_requests_id_seq OWNED BY public.verification_requests.id;


--
-- TOC entry 227 (class 1259 OID 16529)
-- Name: wallet_transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wallet_transactions (
    id integer NOT NULL,
    wallet_id integer NOT NULL,
    type character varying(50) NOT NULL,
    amount numeric(12,2) NOT NULL,
    description text,
    reference_type character varying(50),
    reference_id integer,
    status character varying(50) DEFAULT 'completed'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_transaction_amount CHECK ((amount > (0)::numeric)),
    CONSTRAINT check_transaction_type CHECK (((type)::text = ANY ((ARRAY['earning'::character varying, 'expense'::character varying, 'commission'::character varying, 'withdrawal'::character varying, 'deposit'::character varying])::text[])))
);


ALTER TABLE public.wallet_transactions OWNER TO postgres;

--
-- TOC entry 226 (class 1259 OID 16528)
-- Name: wallet_transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wallet_transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wallet_transactions_id_seq OWNER TO postgres;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 226
-- Name: wallet_transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wallet_transactions_id_seq OWNED BY public.wallet_transactions.id;


--
-- TOC entry 225 (class 1259 OID 16505)
-- Name: wallets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wallets (
    id integer NOT NULL,
    user_id integer NOT NULL,
    balance numeric(12,2) DEFAULT 0,
    total_earnings numeric(12,2) DEFAULT 0,
    total_expenses numeric(12,2) DEFAULT 0,
    total_commission numeric(12,2) DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_wallet_balance CHECK ((balance >= (0)::numeric)),
    CONSTRAINT check_wallet_commission CHECK ((total_commission >= (0)::numeric)),
    CONSTRAINT check_wallet_earnings CHECK ((total_earnings >= (0)::numeric)),
    CONSTRAINT check_wallet_expenses CHECK ((total_expenses >= (0)::numeric))
);


ALTER TABLE public.wallets OWNER TO postgres;

--
-- TOC entry 224 (class 1259 OID 16504)
-- Name: wallets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wallets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wallets_id_seq OWNER TO postgres;

--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 224
-- Name: wallets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wallets_id_seq OWNED BY public.wallets.id;


--
-- TOC entry 229 (class 1259 OID 16548)
-- Name: withdrawals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.withdrawals (
    id integer NOT NULL,
    wallet_id integer NOT NULL,
    amount numeric(12,2) NOT NULL,
    method character varying(50) NOT NULL,
    account_details text NOT NULL,
    status character varying(50) DEFAULT 'pending'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_withdrawal_amount CHECK ((amount > (0)::numeric)),
    CONSTRAINT check_withdrawal_status CHECK (((status)::text = ANY ((ARRAY['pending'::character varying, 'approved'::character varying, 'rejected'::character varying, 'completed'::character varying])::text[])))
);


ALTER TABLE public.withdrawals OWNER TO postgres;

--
-- TOC entry 228 (class 1259 OID 16547)
-- Name: withdrawals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.withdrawals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.withdrawals_id_seq OWNER TO postgres;

--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 228
-- Name: withdrawals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.withdrawals_id_seq OWNED BY public.withdrawals.id;


--
-- TOC entry 3238 (class 2604 OID 16432)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 3276 (class 2604 OID 16616)
-- Name: chat_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages ALTER COLUMN id SET DEFAULT nextval('public.chat_messages_id_seq'::regclass);


--
-- TOC entry 3248 (class 2604 OID 16486)
-- Name: custom_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_orders ALTER COLUMN id SET DEFAULT nextval('public.custom_orders_id_seq'::regclass);


--
-- TOC entry 3266 (class 2604 OID 16575)
-- Name: notifications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications ALTER COLUMN id SET DEFAULT nextval('public.notifications_id_seq'::regclass);


--
-- TOC entry 3239 (class 2604 OID 16441)
-- Name: orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders ALTER COLUMN id SET DEFAULT nextval('public.orders_id_seq'::regclass);


--
-- TOC entry 3231 (class 2604 OID 16412)
-- Name: products id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products ALTER COLUMN id SET DEFAULT nextval('public.products_id_seq'::regclass);


--
-- TOC entry 3246 (class 2604 OID 16465)
-- Name: reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews ALTER COLUMN id SET DEFAULT nextval('public.reviews_id_seq'::regclass);


--
-- TOC entry 3242 (class 2604 OID 16452)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 3225 (class 2604 OID 16398)
-- Name: vendors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors ALTER COLUMN id SET DEFAULT nextval('public.vendors_id_seq'::regclass);


--
-- TOC entry 3270 (class 2604 OID 16596)
-- Name: verification_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_requests ALTER COLUMN id SET DEFAULT nextval('public.verification_requests_id_seq'::regclass);


--
-- TOC entry 3259 (class 2604 OID 16532)
-- Name: wallet_transactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallet_transactions ALTER COLUMN id SET DEFAULT nextval('public.wallet_transactions_id_seq'::regclass);


--
-- TOC entry 3252 (class 2604 OID 16508)
-- Name: wallets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets ALTER COLUMN id SET DEFAULT nextval('public.wallets_id_seq'::regclass);


--
-- TOC entry 3262 (class 2604 OID 16551)
-- Name: withdrawals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdrawals ALTER COLUMN id SET DEFAULT nextval('public.withdrawals_id_seq'::regclass);


--
-- TOC entry 3478 (class 0 OID 16429)
-- Dependencies: 215
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.categories (id, name, description, image) FROM stdin;
1	{"ar": "غرفة المعيشة", "en": "Living Room"}	\N	\N
\.


--
-- TOC entry 3498 (class 0 OID 16613)
-- Dependencies: 235
-- Data for Name: chat_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.chat_messages (id, user_id, custom_order_id, role, message, created_at) FROM stdin;
3	1	1	assistant	Image analysis: An ornate traditional Islamic-style lantern containing multiple small candles, resting on an engraved round tray against an arabesque architectural backdrop.	2026-09-29 01:38:30.345666
\.


--
-- TOC entry 3486 (class 0 OID 16483)
-- Dependencies: 223
-- Data for Name: custom_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.custom_orders (id, user_id, vendor_id, furniture_type, wood_type, size, details, estimated_price, design_url, status, created_at, updated_at, ai_analysis, ai_recommendations) FROM stdin;
1	1	\N	sofa	beech	medium	أريد كنبة 3 أشخاص بلون بني	720	\N	in_progress	2026-09-27 20:32:02.959306	2026-09-29 01:38:30.338435	{"color": "bronze / dark gold", "style": "traditional Islamic / oriental", "material": "metal", "confidence": 0.9, "dimensions": null, "description": "An ornate traditional Islamic-style lantern containing multiple small candles, resting on an engraved round tray against an arabesque architectural backdrop.", "furniture_type": "Decorative lantern / candle holder", "number_of_people": null, "missing_information": ["exact dimensions", "exact metal composition"]}	{"vendors": [], "products": []}
\.


--
-- TOC entry 3494 (class 0 OID 16572)
-- Dependencies: 231
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.notifications (id, user_id, title, message, type, is_read, reference_type, reference_id, created_at) FROM stdin;
1	1	Order Created	Your order #6 has been created successfully.	order	t	order	6	2026-09-27 23:07:16.325944
\.


--
-- TOC entry 3480 (class 0 OID 16438)
-- Dependencies: 217
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, user_id, items, total_amount, shipping_address, status, created_at) FROM stdin;
1	1	[{"color": "بني", "quantity": 2, "productId": 2}]	1700.00	البصرة، العراق	processing	2026-09-26 20:17:58.14063
2	1	[{"color": "بني", "quantity": 2, "productId": 1}]	1700.00	البصرة, العراق	processing	2026-09-26 21:12:11.532389
3	1	[{"price": 850, "quantity": 2, "productId": 1}]	1700.00	البصرة - العشار - شارع الجزائر	processing	2026-09-26 23:09:05.68669
4	1	[{"name": "Wooden Table", "price": 100, "quantity": 1, "vendorId": 1, "productId": 1}]	100.00	Basra, Iraq	processing	2026-09-27 22:02:06.525827
5	1	[{"name": "Wooden Table", "price": 100, "quantity": 1, "vendorId": 1, "productId": 1}]	100.00	Basra, Iraq	processing	2026-09-27 22:14:39.942236
6	1	[{"name": "Wooden Table", "price": 50, "quantity": 1, "vendorId": 1, "productId": 1}]	50.00	Basra, Iraq	processing	2026-09-27 23:07:16.325944
\.


--
-- TOC entry 3476 (class 0 OID 16409)
-- Dependencies: 213
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, title, price, rating, reviews_count, is_customizable, description, dimensions, material, images, colors, category_id, vendor_id) FROM stdin;
2	{"ar": "طاولة طعام خشبية", "en": "Wooden Dining Table"}	850.00	4.5	12	t	طاولة طعام مصنوعة من خشب الزان	220cm x 90cm x 85cm	خشب زان	{https://example.com/table-1.jpg}	[{"code": "#8B4513", "name": "بني"}]	1	1
3	{"ar": "طاولة خشبية", "en": "Wooden Table"}	850.00	4.5	0	t	طاولة خشبية	220cm x 90cm x 85cm	خشب زان	{}	[{"code": "#8B4513", "name": "بني"}]	1	\N
\.


--
-- TOC entry 3484 (class 0 OID 16462)
-- Dependencies: 221
-- Data for Name: reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.reviews (id, user_id, product_id, rating, comment, image, created_at) FROM stdin;
1	1	2	5	منتج ممتاز	https://example.com/review.jpg	2026-09-27 19:55:45.376271
\.


--
-- TOC entry 3482 (class 0 OID 16449)
-- Dependencies: 219
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, name, email, password, role, created_at, is_verified) FROM stdin;
1	Ali	ali@test.com	$2b$10$5EJu65FGh9KDclGwQvJtne1o3PHyA57TZXItU.7gnp/0BS3tYUed.	user	2026-09-26 20:47:10.155853	t
\.


--
-- TOC entry 3474 (class 0 OID 16395)
-- Dependencies: 211
-- Data for Name: vendors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.vendors (id, name, specialty, rating, verified, location, projects_count, experience, image, cover, about, portfolio, latitude, longitude, user_id) FROM stdin;
2	ورشة الإبداع	أعمال خشبية حديثة	4.8	t	البصرة	25	10	https://example.com/vendor.jpg	https://example.com/cover.jpg	ورشة متخصصة بصناعة الأثاث الخشبي حسب الطلب.	{https://example.com/work1.jpg,https://example.com/work2.jpg}	\N	\N	\N
1	ورشة البصرة للأثاث	أعمال خشبية حديثة	4.8	t	بغداد	124	15	https://example.com/vendor.jpg	https://example.com/vendor-cover.jpg	ورشة متخصصة بصناعة الأثاث الخشبي وتصميم القطع حسب الطلب.	{https://example.com/work1.jpg,https://example.com/work2.jpg,https://example.com/work3.jpg}	30.5085	47.7804	1
\.


--
-- TOC entry 3496 (class 0 OID 16593)
-- Dependencies: 233
-- Data for Name: verification_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.verification_requests (id, user_id, official_id_number, workshop_name, documents_image, payment_status, payment_amount, status, admin_note, created_at, updated_at) FROM stdin;
1	1	123456789	ورشة البصرة للأثاث	https://example.com/document.jpg	pending	50.00	approved	Verification approved	2026-09-27 23:46:36.459766	2026-09-28 00:09:21.306495
\.


--
-- TOC entry 3490 (class 0 OID 16529)
-- Dependencies: 227
-- Data for Name: wallet_transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wallet_transactions (id, wallet_id, type, amount, description, reference_type, reference_id, status, created_at) FROM stdin;
1	1	deposit	100.00	Test deposit	\N	\N	completed	2026-09-27 21:20:23.347188
2	1	withdrawal	30.00	Wallet withdrawal	withdrawal	1	completed	2026-09-27 21:33:15.386548
3	1	earning	90.00	Earning from Order #5	order	5	completed	2026-09-27 22:14:39.942236
4	1	commission	10.00	Commission for Order #5	order	5	completed	2026-09-27 22:14:39.942236
5	1	earning	45.00	Earning from Order #6	order	6	completed	2026-09-27 23:07:16.325944
6	1	commission	5.00	Commission for Order #6	order	6	completed	2026-09-27 23:07:16.325944
\.


--
-- TOC entry 3488 (class 0 OID 16505)
-- Dependencies: 225
-- Data for Name: wallets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wallets (id, user_id, balance, total_earnings, total_expenses, total_commission, created_at, updated_at) FROM stdin;
1	1	205.00	135.00	0.00	15.00	2026-09-27 21:06:00.300762	2026-09-27 23:07:16.325944
\.


--
-- TOC entry 3492 (class 0 OID 16548)
-- Dependencies: 229
-- Data for Name: withdrawals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.withdrawals (id, wallet_id, amount, method, account_details, status, created_at, updated_at) FROM stdin;
1	1	30.00	bank	TEST-ACCOUNT-123	pending	2026-09-27 21:33:15.386548	2026-09-27 21:33:15.386548
\.


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 214
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 2, true);


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 234
-- Name: chat_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.chat_messages_id_seq', 3, true);


--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 222
-- Name: custom_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.custom_orders_id_seq', 1, true);


--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 230
-- Name: notifications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_id_seq', 1, true);


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 216
-- Name: orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.orders_id_seq', 6, true);


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 212
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 4, true);


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 220
-- Name: reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.reviews_id_seq', 1, true);


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 218
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 1, true);


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 210
-- Name: vendors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vendors_id_seq', 3, true);


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 232
-- Name: verification_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.verification_requests_id_seq', 1, true);


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 226
-- Name: wallet_transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wallet_transactions_id_seq', 6, true);


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 224
-- Name: wallets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wallets_id_seq', 1, true);


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 228
-- Name: withdrawals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.withdrawals_id_seq', 1, true);


--
-- TOC entry 3293 (class 2606 OID 16436)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 3317 (class 2606 OID 16622)
-- Name: chat_messages chat_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_pkey PRIMARY KEY (id);


--
-- TOC entry 3303 (class 2606 OID 16493)
-- Name: custom_orders custom_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_orders
    ADD CONSTRAINT custom_orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3313 (class 2606 OID 16582)
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- TOC entry 3295 (class 2606 OID 16447)
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- TOC entry 3291 (class 2606 OID 16422)
-- Name: products products_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT products_pkey PRIMARY KEY (id);


--
-- TOC entry 3301 (class 2606 OID 16471)
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (id);


--
-- TOC entry 3297 (class 2606 OID 16460)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3299 (class 2606 OID 16458)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 3289 (class 2606 OID 16407)
-- Name: vendors vendors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT vendors_pkey PRIMARY KEY (id);


--
-- TOC entry 3315 (class 2606 OID 16605)
-- Name: verification_requests verification_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT verification_requests_pkey PRIMARY KEY (id);


--
-- TOC entry 3309 (class 2606 OID 16540)
-- Name: wallet_transactions wallet_transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT wallet_transactions_pkey PRIMARY KEY (id);


--
-- TOC entry 3305 (class 2606 OID 16520)
-- Name: wallets wallets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_pkey PRIMARY KEY (id);


--
-- TOC entry 3307 (class 2606 OID 16522)
-- Name: wallets wallets_user_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT wallets_user_id_key UNIQUE (user_id);


--
-- TOC entry 3311 (class 2606 OID 16560)
-- Name: withdrawals withdrawals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT withdrawals_pkey PRIMARY KEY (id);


--
-- TOC entry 3318 (class 1259 OID 16635)
-- Name: idx_chat_messages_created_at; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chat_messages_created_at ON public.chat_messages USING btree (created_at);


--
-- TOC entry 3319 (class 1259 OID 16634)
-- Name: idx_chat_messages_custom_order_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chat_messages_custom_order_id ON public.chat_messages USING btree (custom_order_id);


--
-- TOC entry 3320 (class 1259 OID 16633)
-- Name: idx_chat_messages_user_id; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_chat_messages_user_id ON public.chat_messages USING btree (user_id);


--
-- TOC entry 3332 (class 2606 OID 16628)
-- Name: chat_messages chat_messages_custom_order_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_custom_order_id_fkey FOREIGN KEY (custom_order_id) REFERENCES public.custom_orders(id) ON DELETE CASCADE;


--
-- TOC entry 3333 (class 2606 OID 16623)
-- Name: chat_messages chat_messages_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.chat_messages
    ADD CONSTRAINT chat_messages_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3325 (class 2606 OID 16494)
-- Name: custom_orders fk_custom_order_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_orders
    ADD CONSTRAINT fk_custom_order_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3326 (class 2606 OID 16499)
-- Name: custom_orders fk_custom_order_vendor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.custom_orders
    ADD CONSTRAINT fk_custom_order_vendor FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;


--
-- TOC entry 3330 (class 2606 OID 16583)
-- Name: notifications fk_notification_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3322 (class 2606 OID 16423)
-- Name: products fk_product_vendor; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.products
    ADD CONSTRAINT fk_product_vendor FOREIGN KEY (vendor_id) REFERENCES public.vendors(id) ON DELETE SET NULL;


--
-- TOC entry 3323 (class 2606 OID 16477)
-- Name: reviews fk_review_product; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_review_product FOREIGN KEY (product_id) REFERENCES public.products(id) ON DELETE CASCADE;


--
-- TOC entry 3324 (class 2606 OID 16472)
-- Name: reviews fk_review_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT fk_review_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3328 (class 2606 OID 16541)
-- Name: wallet_transactions fk_transaction_wallet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallet_transactions
    ADD CONSTRAINT fk_transaction_wallet FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE CASCADE;


--
-- TOC entry 3321 (class 2606 OID 16566)
-- Name: vendors fk_vendor_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.vendors
    ADD CONSTRAINT fk_vendor_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE SET NULL;


--
-- TOC entry 3331 (class 2606 OID 16606)
-- Name: verification_requests fk_verification_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.verification_requests
    ADD CONSTRAINT fk_verification_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3327 (class 2606 OID 16523)
-- Name: wallets fk_wallet_user; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wallets
    ADD CONSTRAINT fk_wallet_user FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- TOC entry 3329 (class 2606 OID 16561)
-- Name: withdrawals fk_withdrawal_wallet; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.withdrawals
    ADD CONSTRAINT fk_withdrawal_wallet FOREIGN KEY (wallet_id) REFERENCES public.wallets(id) ON DELETE CASCADE;


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 5
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


-- Completed on 2026-09-29 14:54:16

--
-- PostgreSQL database dump complete
--

\unrestrict aXv2cB47qZ3ayVfnZZNHYfQIZMbW2cH3ssDBOwBES5HR8jvsNbSew0wlDjmPTbT

