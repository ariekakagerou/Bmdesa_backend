import express from 'express';
import axios from 'axios';
const router = express.Router();

// Config Defaults Axios dengan Detail Akun Rajaongkir
axios.defaults.baseURL = 'https://api.rajaongkir.com/starter';
axios.defaults.headers.common['key'] = 'mbNw0tWR75a2e17747fa75cbR2NUdRjL';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// Router GET province
router.get('/provinsi', (req, res) => {
    axios.get('/province')
        .then(response => res.json(response.data))
        .catch(err => res.send(err));
});

// Router GET city by province_id
router.get('/kota/:provId', (req, res) => {
    const id = req.params.provId;
    axios.get(`/city?province=${id}`)
        .then(response => res.json(response.data))
        .catch(err => res.send(err));
});

// Router GET costs
router.get('/ongkos/:asal/:tujuan/:berat/:kurir', (req, res) => {
    const param = req.params;
    axios.post('/cost', {
            origin: param.asal,
            destination: param.tujuan,
            weight: param.berat,
            courier: param.kurir
        })
        .then(response => res.json(response.data))
        .catch(err => res.send(err));
});

// Definisikan apiRoutes
const apiRoutes = router;

export default apiRoutes; // Pastikan ekspor default ada di sini