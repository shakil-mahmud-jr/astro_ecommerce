PGDMP                      }            bazar_db    17.2    17.2 $    z           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            {           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            |           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            }           1262    16594    bazar_db    DATABASE     �   CREATE DATABASE bazar_db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE bazar_db;
                     postgres    false                        3079    16595 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            ~           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            s           1247    16722    order_paymentstatus_enum    TYPE     q   CREATE TYPE public.order_paymentstatus_enum AS ENUM (
    'pending',
    'paid',
    'failed',
    'refunded'
);
 +   DROP TYPE public.order_paymentstatus_enum;
       public               postgres    false            g           1247    16647    order_status_enum    TYPE     �   CREATE TYPE public.order_status_enum AS ENUM (
    'pending',
    'processing',
    'shipped',
    'delivered',
    'cancelled'
);
 $   DROP TYPE public.order_status_enum;
       public               postgres    false            v           1247    19389    users_role_enum    TYPE     V   CREATE TYPE public.users_role_enum AS ENUM (
    'admin',
    'seller',
    'user'
);
 "   DROP TYPE public.users_role_enum;
       public               postgres    false            �            1259    16626    category    TABLE     �  CREATE TABLE public.category (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    slug character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "imageUrl" character varying,
    "metaTitle" character varying,
    "metaDescription" character varying(160),
    "isActive" boolean DEFAULT true NOT NULL,
    "displayOrder" integer DEFAULT 0 NOT NULL,
    "productCount" integer DEFAULT 0 NOT NULL,
    mpath character varying DEFAULT ''::character varying,
    "parentId" uuid
);
    DROP TABLE public.category;
       public         heap r       postgres    false    2            �            1259    16706    customer    TABLE       CREATE TABLE public.customer (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    phone character varying NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    city character varying,
    state character varying,
    "zipCode" character varying,
    country character varying,
    "totalOrders" integer DEFAULT 0 NOT NULL,
    "totalSpent" numeric(10,2) DEFAULT '0'::numeric NOT NULL,
    "lastOrderDate" timestamp without time zone,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    address character varying,
    notes character varying
);
    DROP TABLE public.customer;
       public         heap r       postgres    false    2            �            1259    16657    order    TABLE     �  CREATE TABLE public."order" (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "trackingNumber" character varying,
    status public.order_status_enum DEFAULT 'pending'::public.order_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "paymentStatus" public.order_paymentstatus_enum DEFAULT 'pending'::public.order_paymentstatus_enum NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    tax numeric(10,2) NOT NULL,
    shipping numeric(10,2) NOT NULL,
    total numeric(10,2) NOT NULL,
    notes character varying,
    "userId" uuid,
    "shippingAddress" character varying,
    "billingAddress" character varying
);
    DROP TABLE public."order";
       public         heap r       postgres    false    2    871    883    871    883            �            1259    16668 
   order_item    TABLE     �   CREATE TABLE public.order_item (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    price numeric(10,2) NOT NULL,
    subtotal numeric(10,2) NOT NULL,
    "orderId" uuid,
    "productId" uuid
);
    DROP TABLE public.order_item;
       public         heap r       postgres    false    2            �            1259    16636    product    TABLE     �  CREATE TABLE public.product (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    description text NOT NULL,
    price numeric(10,2) NOT NULL,
    "imageUrl" character varying,
    sku character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "categoryId" uuid,
    stock integer NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL,
    brand character varying,
    weight numeric(10,2),
    dimensions character varying,
    "metaTitle" character varying,
    "metaDescription" character varying,
    "sellerId" uuid
);
    DROP TABLE public.product;
       public         heap r       postgres    false    2            �            1259    16606    users    TABLE     S  CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    role public.users_role_enum DEFAULT 'user'::public.users_role_enum NOT NULL,
    "storeName" character varying,
    "storeDescription" character varying,
    "isVerified" boolean DEFAULT false NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false    2    886    886            s          0    16626    category 
   TABLE DATA           �   COPY public.category (id, name, description, slug, "createdAt", "updatedAt", "imageUrl", "metaTitle", "metaDescription", "isActive", "displayOrder", "productCount", mpath, "parentId") FROM stdin;
    public               postgres    false    219   69       w          0    16706    customer 
   TABLE DATA           �   COPY public.customer (id, "firstName", "lastName", email, phone, "isActive", city, state, "zipCode", country, "totalOrders", "totalSpent", "lastOrderDate", "createdAt", "updatedAt", address, notes) FROM stdin;
    public               postgres    false    223   <       u          0    16657    order 
   TABLE DATA           �   COPY public."order" (id, "trackingNumber", status, "createdAt", "updatedAt", "paymentStatus", subtotal, tax, shipping, total, notes, "userId", "shippingAddress", "billingAddress") FROM stdin;
    public               postgres    false    221   �=       v          0    16668 
   order_item 
   TABLE DATA           [   COPY public.order_item (id, quantity, price, subtotal, "orderId", "productId") FROM stdin;
    public               postgres    false    222   �?       t          0    16636    product 
   TABLE DATA           �   COPY public.product (id, name, description, price, "imageUrl", sku, "createdAt", "updatedAt", "categoryId", stock, "isActive", brand, weight, dimensions, "metaTitle", "metaDescription", "sellerId") FROM stdin;
    public               postgres    false    220   �A       r          0    16606    users 
   TABLE DATA           �   COPY public.users (id, email, "firstName", "lastName", password, "createdAt", "updatedAt", role, "storeName", "storeDescription", "isVerified") FROM stdin;
    public               postgres    false    218   �H       �           2606    16667 $   order PK_1031171c13130102495201e3e20 
   CONSTRAINT     f   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "PK_1031171c13130102495201e3e20" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public."order" DROP CONSTRAINT "PK_1031171c13130102495201e3e20";
       public                 postgres    false    221            �           2606    16635 '   category PK_9c4e4a89e3674fc9f382d733f03 
   CONSTRAINT     g   ALTER TABLE ONLY public.category
    ADD CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.category DROP CONSTRAINT "PK_9c4e4a89e3674fc9f382d733f03";
       public                 postgres    false    219            �           2606    16615 $   users PK_a3ffb1c0c8416b9fc6f907b7433 
   CONSTRAINT     d   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433";
       public                 postgres    false    218            �           2606    16718 '   customer PK_a7a13f4cacb744524e44dfdad32 
   CONSTRAINT     g   ALTER TABLE ONLY public.customer
    ADD CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.customer DROP CONSTRAINT "PK_a7a13f4cacb744524e44dfdad32";
       public                 postgres    false    223            �           2606    16645 &   product PK_bebc9158e480b949565b4dc7a82 
   CONSTRAINT     f   ALTER TABLE ONLY public.product
    ADD CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY (id);
 R   ALTER TABLE ONLY public.product DROP CONSTRAINT "PK_bebc9158e480b949565b4dc7a82";
       public                 postgres    false    220            �           2606    16673 )   order_item PK_d01158fe15b1ead5c26fd7f4e90 
   CONSTRAINT     i   ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.order_item DROP CONSTRAINT "PK_d01158fe15b1ead5c26fd7f4e90";
       public                 postgres    false    222            �           2606    16617 $   users UQ_97672ac88f789774dd47f7c8be3 
   CONSTRAINT     b   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3";
       public                 postgres    false    218            �           2606    16699 '   category UQ_cb73208f151aa71cdd78f662d70 
   CONSTRAINT     d   ALTER TABLE ONLY public.category
    ADD CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70" UNIQUE (slug);
 S   ALTER TABLE ONLY public.category DROP CONSTRAINT "UQ_cb73208f151aa71cdd78f662d70";
       public                 postgres    false    219            �           2606    16720 '   customer UQ_fdb2f3ad8115da4c7718109a6eb 
   CONSTRAINT     e   ALTER TABLE ONLY public.customer
    ADD CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb" UNIQUE (email);
 S   ALTER TABLE ONLY public.customer DROP CONSTRAINT "UQ_fdb2f3ad8115da4c7718109a6eb";
       public                 postgres    false    223            �           2606    16684 )   order_item FK_646bf9ece6f45dbe41c203e06e0    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0" FOREIGN KEY ("orderId") REFERENCES public."order"(id);
 U   ALTER TABLE ONLY public.order_item DROP CONSTRAINT "FK_646bf9ece6f45dbe41c203e06e0";
       public               postgres    false    4820    222    221            �           2606    16689 )   order_item FK_904370c093ceea4369659a3c810    FK CONSTRAINT     �   ALTER TABLE ONLY public.order_item
    ADD CONSTRAINT "FK_904370c093ceea4369659a3c810" FOREIGN KEY ("productId") REFERENCES public.product(id);
 U   ALTER TABLE ONLY public.order_item DROP CONSTRAINT "FK_904370c093ceea4369659a3c810";
       public               postgres    false    222    220    4818            �           2606    16732 $   order FK_caabe91507b3379c7ba73637b84    FK CONSTRAINT     �   ALTER TABLE ONLY public."order"
    ADD CONSTRAINT "FK_caabe91507b3379c7ba73637b84" FOREIGN KEY ("userId") REFERENCES public.users(id);
 R   ALTER TABLE ONLY public."order" DROP CONSTRAINT "FK_caabe91507b3379c7ba73637b84";
       public               postgres    false    218    4810    221            �           2606    16700 '   category FK_d5456fd7e4c4866fec8ada1fa10    FK CONSTRAINT     �   ALTER TABLE ONLY public.category
    ADD CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10" FOREIGN KEY ("parentId") REFERENCES public.category(id);
 S   ALTER TABLE ONLY public.category DROP CONSTRAINT "FK_d5456fd7e4c4866fec8ada1fa10";
       public               postgres    false    219    219    4814            �           2606    19408 &   product FK_d5cac481d22dacaf4d53f900a3f    FK CONSTRAINT     �   ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_d5cac481d22dacaf4d53f900a3f" FOREIGN KEY ("sellerId") REFERENCES public.users(id);
 R   ALTER TABLE ONLY public.product DROP CONSTRAINT "FK_d5cac481d22dacaf4d53f900a3f";
       public               postgres    false    220    4810    218            �           2606    16674 &   product FK_ff0c0301a95e517153df97f6812    FK CONSTRAINT     �   ALTER TABLE ONLY public.product
    ADD CONSTRAINT "FK_ff0c0301a95e517153df97f6812" FOREIGN KEY ("categoryId") REFERENCES public.category(id);
 R   ALTER TABLE ONLY public.product DROP CONSTRAINT "FK_ff0c0301a95e517153df97f6812";
       public               postgres    false    220    4814    219            s   �  x���M��8�Ϛ_�SN)#��}ˆ����$��\J�6鴃�d���[m�O�#��y��7y�R.R�	Lv��TL����F�=��'��0����jn���x�R�D��F����{ҷ���,$?iL��Œ%&�AE0)"���RC�V������7���Y�:e1�����;^���Xx����*!X���� 2@���*�UQ|����/���K�U+�Q�ޓ6�{@�lr�l�T�*j&��zc�틗��c��뻡Si*�eg}_Q)�Y��z���%��6�{8���<y���k1)���){��Ñ��4��<_͛R��(�l��΢^��l������=�k�$%s�P�
�Dŝ���3������0�Ż�?i��W����#zn�?K�����֎�:�� �R�hi xb�5VR�c��ȱѼi���p;.�R�8-&�]&o�s�1�˰n>s(p��N���6hN�'m�j���c���5�nq�hJ�zR��F|9��7��f���ç��Yi�OU\f/�hd��q�aD����a߃����[��;����%�;+{��M��S�n��_tl��0���t�����%�z��Ciũ>����r��;���ۨ}4�����,'�{U\;XS{��*p�,`LM�tt�]�Y�"m��zIR�nޏ��s�������u>(sO��Y�������      w   �  x���O�A����z����?{��%!��!��^zzzt�:a�l>~�Ս A����]ޏzec�ZPe/Z�@AE!�r)]�5JFx�[x�3�JQ5}����ͯu�R���؈u> �a�_����fϠQ���4	V�@HF!)-c�w��fr�!f��VNċ�&�����p��S%�LK�B۠"�m�Vcv�6�|�헰*e�;��;+�I�i�O����;��@����
��c���$1<�P���l�!��A��u�N6y���yؿ�c�oaxk���&b6FZ�_v).z�:���A|߅VtB�X�&!J\�f�Tn�LdR!ԭ��\rT�2<š��%�|�CS-.D�Z�+�x�⦃�S`�'��$����2R�&�n�iR��I9��%L�s�B�$x���>���C]���s�}����߯3�(1��ʱT|��q��asM:�T���/M��      u   �  x����n�0���S�F���?�u�mv�E���h�I��o?�m�KS�P�>Q��#U�rA�p��D�I�s�R�����K��;��Z@g���b���k�H/qG�#^#mK��|���]� O�B��d
���.&1�����<_^Z|��\N/H��Kp"s�!�U@����6�>��a��'�wX�)���	Ê��ڸ�(__)-nk�g5��ԃ���eo�|�c'�̗</�ߗ:���G&�Q�M
c;:M!�6��~>�yw���{1���Ƚ�u���<:�sXo�S�[�.� \�BC�

�qre�>�o��ƻJW)ka'ͳ<�X ��\KI#��i������=�3H��gd���=X6��C+]�����ݪ�v������ȫ��T2+Xj��u� �)`�49Q��j>�]�����      v   �  x���M�� ���]�B���(��C�g5o�J��0|�N�\q:��
m���w�m�W�����w�S0F�0��'���������V�h-�MG��	��nm���w:o�'^U�n��	�Lx$�.<a��m�>�R��V'�
6E�uږ+�tdM�}���&B�"���y����7(�Xp�#��f�۴�7���w��k.0x壹Pk��c�屙�<�&�3a$ӌ����T��"�v���ˁL,;��s�����Z�;�9>���5�Y�;���yX���w�4�T�lu�����`�j ��	/��?��w�oR���q�� ƙǢ�[��'u�U�^�>��Ȑ�K��ʽ\:�D9���'�yW>�����F|��W�w�x!j�-�5�����"��qPSb��ir+��)RU���?.�����Wr��R�Y�S�j9�p��&2���q��'���L      t   �  x��X�R#I='_P�ľ��[р����R#)eʤ�������|�xj�����I鑑�?w㐣ʂ�,%U��:�%2+��6���8��(��Q��f8�w��fR�y�Hj����������$����+�Y�X5����tܤ06m7P���ټ��kOf�&��Ǘ[z{����[ʘ��2A�$L8([s��S/�b�91�t�S��1&GS��d�8���S�C����a�+Vs]I�(�"iRU�����d)�����em��!Z	%�6$���ɚ%��4{M�߶4�=.�@�R����$9^�N3�:��1��.K��g���������Jј9�ް�KN9��!�z4����̒��������H_����	]hbʽ�ࡓa4@є���N�߇�1ēP�s��b� xe����Bmr��8���p�n1�d��{*6�ԕyK�Q��*v�̀��Z�$jҢv�E4���:f��E�ζ�^h��1*
�À�$���I�w�@5�f l�QN�84ف`�f�Y_���X`�ic��S���A0 ��W��S��;�E��9��������QnXv<��P�n&a�͆�ȿ���Aۑv{�Q7$a�M�H��=̡��������ru��P8�hQS3.��GM�Y#l�E06XM�(
��c�F8�B�*��-��/f׏��ծ?��:	1�1M� ���b�9|�wM,��g]3#������f�d����A2�	�f��j����������g�z��뀊}�b!��Q�G��U�L9�Y.�$u	��G!��	��=��y�Lz�}~e�q6��]��t*C���̶K����oσ��k��5�1��CR��Xa�C
48ahQڠ�[��]�m����X�P�}�[���x�4�����@Crհآ�	r�a���u`���j��h�� ���L[��� r��*��}<GuC��(���/�|���|«��bu�c�����9c�C�b*��PTܑ� �a�FY�lS��/~��g�=t��{ 7��N�VL���Gk��ئ<�,&��p��N��DB8�)0>�����?��Ӗ����uc��5�}���>\׆K��I��5C	��]�3����HqS�q�6	�-��aD�v�z��}�w4{��}�j�t�c�3���t���cv�T�m�cA����:�^)�w/�^�i���:ķ����Ԋ�O�G=$�̠�M�Z[�R����nH1g�Ó0M�R�<C�\�@���gaZδz��*��8L/�V3�>��Ô�:E�Nу
_[mEk7w�<�[,X�[vρ��I����:�b���,��PF��8���b��5O��.����W�}�zK>}�|�������|����f�������(���n
y!ҫn�`��]��w�B�6Ю;0���p��׿���a�k��h�6c|��&�R�D;�(��/|G&ᾯ����`]�V�?���{5��~�5����W����w��s���u��kE��![("x?M2�&�dR<5����L��
��	��+fP�%�c���c�('j9h��.���[�q��ő�Q� {�e�X�٠t��f
ᾯz��]}��?a���M����A�wZ1z�\�ƿdz=��<"�"�c�c�%\��EI���D)�H�Z�v�?�൬z5�k� '��SJ�uS{W�|Ʉ���8�#��2��.DI-��J�A*��i�a��q���Qv��g}rr�?M���      r   �  x����n�:��ӧ�Eo|v�UK%�h)E#mٱ)I8� ��wh;�]�5�EZr�-�ˋ�8�@n��@
� �8�1�1�!�.�uil��URjߚһ7����_�U�za��̻����qԛM�D���7���n�^Ϛk�����v2���f�h��<���W�Z��1�C�#\�SRYؕ��sX�#�f@'c@� ����k�a��P��o<�ˍ����ks�x'R\��Ԫ�a���Mf��n�\��q����3�c�Q�OI�dI�iJ;i�1 V���B*������[�ӿ1t���F�0��45�Z��^��cѝ��V��Z�]9�F�ElFe'2+���u����P��X�&��(8Pc ��RYD��,��̮Хݩl�Z?�gޏ�4�n��[����Wa��������SIOJG��Nrf�Dq��T8%�BџH�I���g�z��Pb��)�� �Hu& ��V�h��VHI�U1'������'�՜ߦ���q���n����t[�rF�cE��1�t)�,2��	?{���&�=O�ҡ���CQG�'DH|�d��pp�� ;D!@Va@Q�@��z3�:$��ؼG����v�Wo����w����������!���ʛ5����â7XHL��-�h��q}@2��9Du��X�?��V:,&(ЊZ�ѡ!�;4$� �XC���~����~x�ڳ����r�����d�c�a7���y����9 �l�m�x�>G���WP^��'UQ~J:����$%r�Y,�^TT� Wu[����5-����Jù��d*I߇Q	���ן�y���fs}S&��3����:�\��_[G��Z>���E����n�����J��4�����:�U��RTu NIG�~�ggg�9�      