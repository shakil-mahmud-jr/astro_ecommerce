PGDMP  "    	                }            customer    17.2    17.2     d           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            e           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            f           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            g           1262    17470    customer    DATABASE     �   CREATE DATABASE customer WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United States.1252';
    DROP DATABASE customer;
                     postgres    false                        3079    17471 	   uuid-ossp 	   EXTENSION     ?   CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;
    DROP EXTENSION "uuid-ossp";
                        false            h           0    0    EXTENSION "uuid-ossp"    COMMENT     W   COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';
                             false    2            �            1259    17538    cart    TABLE       CREATE TABLE public.cart (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    price numeric(10,2) NOT NULL,
    "userId" uuid,
    "productId" uuid
);
    DROP TABLE public.cart;
       public         heap r       postgres    false    2            �            1259    19031 
   cart_items    TABLE     M  CREATE TABLE public.cart_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    quantity integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid,
    "productId" uuid,
    price numeric(10,2) NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL
);
    DROP TABLE public.cart_items;
       public         heap r       postgres    false    2            �            1259    17494    products    TABLE     �  CREATE TABLE public.products (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    price numeric(10,2) NOT NULL,
    "oldPrice" numeric(10,2),
    "imageUrl" character varying NOT NULL,
    category character varying NOT NULL,
    rating numeric(3,1) NOT NULL,
    "reviewCount" integer NOT NULL,
    "inStock" boolean DEFAULT true NOT NULL,
    "isFeatured" boolean DEFAULT false NOT NULL,
    "isOnSale" boolean DEFAULT false NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    description character varying
);
    DROP TABLE public.products;
       public         heap r       postgres    false    2            �            1259    19019    users    TABLE     �  CREATE TABLE public.users (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    email character varying NOT NULL,
    "firstName" character varying NOT NULL,
    "lastName" character varying NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    role character varying DEFAULT 'user'::character varying NOT NULL,
    avatar character varying,
    "phoneNumber" character varying,
    address character varying,
    city character varying,
    country character varying,
    "postalCode" character varying,
    "isEmailVerified" boolean DEFAULT false NOT NULL,
    "isActive" boolean DEFAULT true NOT NULL
);
    DROP TABLE public.users;
       public         heap r       postgres    false    2            �            1259    17519    wishlist    TABLE     �   CREATE TABLE public.wishlist (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid,
    "productId" uuid
);
    DROP TABLE public.wishlist;
       public         heap r       postgres    false    2            �            1259    19038    wishlist_items    TABLE     �   CREATE TABLE public.wishlist_items (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "userId" uuid,
    "productId" uuid
);
 "   DROP TABLE public.wishlist_items;
       public         heap r       postgres    false    2            ^          0    17538    cart 
   TABLE DATA           W   COPY public.cart (id, quantity, "createdAt", price, "userId", "productId") FROM stdin;
    public               postgres    false    220   �)       `          0    19031 
   cart_items 
   TABLE DATA           j   COPY public.cart_items (id, quantity, "createdAt", "userId", "productId", price, "updatedAt") FROM stdin;
    public               postgres    false    222   �)       \          0    17494    products 
   TABLE DATA           �   COPY public.products (id, name, price, "oldPrice", "imageUrl", category, rating, "reviewCount", "inStock", "isFeatured", "isOnSale", "createdAt", "updatedAt", description) FROM stdin;
    public               postgres    false    218   �*       _          0    19019    users 
   TABLE DATA           �   COPY public.users (id, email, "firstName", "lastName", password, "createdAt", "updatedAt", role, avatar, "phoneNumber", address, city, country, "postalCode", "isEmailVerified", "isActive") FROM stdin;
    public               postgres    false    221   )4       ]          0    17519    wishlist 
   TABLE DATA           J   COPY public.wishlist (id, "createdAt", "userId", "productId") FROM stdin;
    public               postgres    false    219   ^5       a          0    19038    wishlist_items 
   TABLE DATA           P   COPY public.wishlist_items (id, "createdAt", "userId", "productId") FROM stdin;
    public               postgres    false    223   {5       �           2606    17508 '   products PK_0806c755e0aca124e67c0cf6d7d 
   CONSTRAINT     g   ALTER TABLE ONLY public.products
    ADD CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.products DROP CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d";
       public                 postgres    false    218            �           2606    19044 -   wishlist_items PK_0bd52924a97cda208ed2a07bd69 
   CONSTRAINT     m   ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT "PK_0bd52924a97cda208ed2a07bd69" PRIMARY KEY (id);
 Y   ALTER TABLE ONLY public.wishlist_items DROP CONSTRAINT "PK_0bd52924a97cda208ed2a07bd69";
       public                 postgres    false    223            �           2606    17525 '   wishlist PK_620bff4a240d66c357b5d820eaa 
   CONSTRAINT     g   ALTER TABLE ONLY public.wishlist
    ADD CONSTRAINT "PK_620bff4a240d66c357b5d820eaa" PRIMARY KEY (id);
 S   ALTER TABLE ONLY public.wishlist DROP CONSTRAINT "PK_620bff4a240d66c357b5d820eaa";
       public                 postgres    false    219            �           2606    19037 )   cart_items PK_6fccf5ec03c172d27a28a82928b 
   CONSTRAINT     i   ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b" PRIMARY KEY (id);
 U   ALTER TABLE ONLY public.cart_items DROP CONSTRAINT "PK_6fccf5ec03c172d27a28a82928b";
       public                 postgres    false    222            �           2606    19028 $   users PK_a3ffb1c0c8416b9fc6f907b7433 
   CONSTRAINT     d   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY (id);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433";
       public                 postgres    false    221            �           2606    17544 #   cart PK_c524ec48751b9b5bcfbf6e59be7 
   CONSTRAINT     c   ALTER TABLE ONLY public.cart
    ADD CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7" PRIMARY KEY (id);
 O   ALTER TABLE ONLY public.cart DROP CONSTRAINT "PK_c524ec48751b9b5bcfbf6e59be7";
       public                 postgres    false    220            �           2606    19030 $   users UQ_97672ac88f789774dd47f7c8be3 
   CONSTRAINT     b   ALTER TABLE ONLY public.users
    ADD CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE (email);
 P   ALTER TABLE ONLY public.users DROP CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3";
       public                 postgres    false    221            �           2606    19056 -   wishlist_items FK_3167e7490f12ed329a36703d980    FK CONSTRAINT     �   ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT "FK_3167e7490f12ed329a36703d980" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.wishlist_items DROP CONSTRAINT "FK_3167e7490f12ed329a36703d980";
       public               postgres    false    223    4800    221            �           2606    19061 -   wishlist_items FK_485ece8ab9b569d1c560144aa25    FK CONSTRAINT     �   ALTER TABLE ONLY public.wishlist_items
    ADD CONSTRAINT "FK_485ece8ab9b569d1c560144aa25" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;
 Y   ALTER TABLE ONLY public.wishlist_items DROP CONSTRAINT "FK_485ece8ab9b569d1c560144aa25";
       public               postgres    false    218    4794    223            �           2606    19051 )   cart_items FK_72679d98b31c737937b8932ebe6    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_72679d98b31c737937b8932ebe6" FOREIGN KEY ("productId") REFERENCES public.products(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.cart_items DROP CONSTRAINT "FK_72679d98b31c737937b8932ebe6";
       public               postgres    false    222    4794    218            �           2606    19046 )   cart_items FK_84e765378a5f03ad9900df3a9ba    FK CONSTRAINT     �   ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT "FK_84e765378a5f03ad9900df3a9ba" FOREIGN KEY ("userId") REFERENCES public.users(id) ON DELETE CASCADE;
 U   ALTER TABLE ONLY public.cart_items DROP CONSTRAINT "FK_84e765378a5f03ad9900df3a9ba";
       public               postgres    false    221    4800    222            ^      x������ � �      `     x���;n1Ek�*��3�YK�����I����@�@�l���k��Jb�-(q6��Q�������P<hwh5k���OBvP�2�����bT-��ͦ O�����ѭ��^H�xc	?,wC6�s����u@�d0q���k���S���b���^���9t��6���U����-{v��N��A���5@�����Lm��V�'A_��C�%���'k��}���`|�B�ә�:�߶߬cK�*��}]�'��z0      \   !	  x��Y�n�}Ec_m��b ��.��eӻV �T�$�4G )���O��#�~22l�rM�T�:��D�͞22U�Gl,�3��;	8�fޭ��w����\�F*���F������~��͛�%�|�-��ؽ1�}S���9��R�}��m�Vq�g8�]�^��͚m�%�Д	�$�-�o�~������o}�z���$I9���<,8�l�K�y��kr�����"u�?e�e_7#���Vs_�[,�4���L��kou�BJ����\8M�%�U��梻]ls�#?{���wg�z�5��d,=V�c5c�l��"o�$���Ԛ�+Z#h�P唢΂�<�#�P8kN�M&��a�.���}��-������quU��	��*��M�:)3�\U\����i�b��2�,�*=����z����6\�}Ol��J�l�=�x���dxR�YFC28A!*�
|d�	E��z	��-l݊hr� �y^mr��č��z���S9ȷҦ�_���BUx��0M=ĀE�$$�6'���LN��.m�9;n�Y��'�d�n�ѻv�DLPR{�5�8�U4�q@9�Hl��e�%��D~O��M~$3l�� aǍ�`�k~Y�]w�E��j'���P�8+.Tn&��<Ҥ���_М���\�	�w�*[MEi�E��]%�e��d��u�iM��{[���=
�	25'�?����32�kQ��z�=��KOWc��Z�j{��K��{-��$Yd���ͩ�*S��7���.6��1��H��~��R2 ����ޱ��O[�2��P������](&�M
?�@X�e��J�Ɵ��3{��k�q���8þQ�و�4f�`傣�q(� QӢJ,9ITisX7�7�6[t<r��Z�7��|���=��3���f�g4���3�@˒
���-w��osƵP09Y��bC����+�ފ�����B?ML/�SKr�8�S�1���&d(�M2�0�U���T�McwUرcS�
�a�Jŧ���Vj�0ວ*ZN�)�`�(���n�[�vd�]g�B�r�L.�_��Ռ�e�V���4J�ɽ��:5��5�%�B
j0�`�Ɍb�:g��o���!m��
�;���m����v@� ЁZ�� ��AaCu0!��1��w�՟���vB��!�9�p~���?}{0���zJ&�"��!�H���n��GShu��dRs�|��_y� 7�O�c�e�h+F{�DnH.�Tb���G�2������
ŕ͹��[o`�&�}�����O�8؃��U���(��R� �20����b ��r�ݦC�2X|Zr���胷)��jwP폖��N5�"����b��<� ���hc�`��y���b��|�f<E���?��l*C��$8��25��sh,*����?�Vwy��Bޝcؼٛ}=V�ޝ����%���+����9L�`�A�ۜ(���b��ϼ�v��Ff���c$�z�
�V�g�2�)l`I��%a$�!�:L.T�lu�F$·��+>h�/�^v���`~����OY�B�M��ո�V���v,��V�(�rGfm�xf�-B��lP�a�"eB��a�W�*���T��R��`��]����c~J.��1�xw��L�����Zk����as�)
���e�73"���kFO��F_���=����ք�bYe�3�gNX�s�V����K�{Ž�۝�?�3��ߛx���BI�e�2�H�k��r��y�e�١0h�r�������7zO ɕjz�E� <V¼��2I�����p��Cd<]/:�Λc<b=������{��b�>z�Q�V�ϟCM$5+(L����x�u��;Vn~�f��̻���X�_@��:�����I�E�ݽ��Oʫ��q�2{Qo�����p}7�r��Q����X!���"V�2
0n�E��X�h����:���=^���x�?\࿀֖ ��S-5N�f�z�R�$㶈���}�m�Q��)�>SY��I�E�r�u*{O�M�2��
�^f���Nf�6d�k�
�K��u�z�u��Sos�������!R�0�J<4�v�a���s��e�n�X�Ag�1�h+�An�4�C��Og�c)�a$��	�EF�ͫ�kG.�����~�{c��aZ��"4/1ڶ��.���$l�L�H�&�;�x�ӠV�k~+�W�����n����=
E2�͜��\~F��!E�p��w�*���l���>p��K�.9d"��h�x�j8�8	S3�>���]�\���_V!@[�5�������W�^���a      _   %  x�}ϻn�0���y
V�_b���&�*܂��XN�8�$���TU�: ��?}JZ�JE�!�!�2�iB�(��HA<׶:�^�
�o���+���j[���˲n �2�a��;�X�������%�c+'2U�E��{�o��-~=n��0`���;��!�s�k��g���+����H��@n���if��\(k@hq���U�Ǫ�a�W?F'�>$������CU�e:^��i��f���E��,���z����Vv�7nZm&�5�5�������A��y�����}�'y"      ]      x������ � �      a   @  x��ѻm1���
7�����8!��ˑ_r��GLS2�Ѡ�h3��怱jna�/F6@�/���A��¬���Lw��JP�	U[���J��/���6���N
�D M�(1G�K&V���QG���*��M�]bt��&�R�m
�]=���O|dK�ȋZ��e��O]j�jӏR�D�Q�QT�|&	�Q9'��k��[E\9袚��h� E��U��JƠI�'�/ԇ�!����uڠr_�u��P>6
����tY�B]��@�t��g�=�]�zwbf�PBS��P�v6�������y}��u� 81��     