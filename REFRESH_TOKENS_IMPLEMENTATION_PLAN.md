# Plan d'implémentation : Refresh Tokens JWT

## 📋 Objectif
Implémenter un système de refresh tokens pour prolonger automatiquement la session utilisateur sans redemander login.

## 🏗️ Architecture

### Backend (FastAPI)

1. **Modèle RefreshToken** (nouveau)
```python
class RefreshToken(BaseModel):
    token: str
    userId: str
    expiresAt: datetime
    createdAt: datetime
```

2. **Endpoints à ajouter**
- `POST /api/auth/refresh` - Rafraîchir le token
- `POST /api/auth/revoke` - Révoquer un refresh token

3. **Modifications auth.py**
- Fonction `create_refresh_token(user_id)` → 7 jours
- Fonction `verify_refresh_token(token)` 
- Storage MongoDB des refresh tokens

4. **Flow de login modifié**
```
Login → Retourne access_token (30min) + refresh_token (7j)
```

### Frontend (React)

1. **Storage**
```javascript
// localStorage
{
  tkbshop_token: "access_token",
  tkbshop_refresh_token: "refresh_token",
  tkbshop_user: "{user_data}"
}
```

2. **Axios Interceptor**
```javascript
// Sur 401 Unauthorized
1. Récupérer refresh_token
2. Appeler /api/auth/refresh
3. Si succès → nouveau access_token → Retry request
4. Si échec → Logout
```

3. **Auto-refresh préventif**
```javascript
// useEffect dans AuthContext
setInterval(() => {
  if (tokenExpiresSoon()) {
    refreshToken();
  }
}, 5 * 60 * 1000); // Check every 5min
```

## 📅 Implémentation

### Phase 1 - Backend (1-2h)
1. ✅ Créer modèle RefreshToken
2. ✅ Ajouter collection MongoDB
3. ✅ Fonctions create/verify/revoke
4. ✅ Modifier /login et /register pour retourner refresh_token
5. ✅ Endpoint /refresh
6. ✅ Tests

### Phase 2 - Frontend (1h)
1. ✅ Stocker refresh_token dans localStorage
2. ✅ Interceptor Axios pour 401
3. ✅ Fonction refreshToken()
4. ✅ Auto-refresh préventif
5. ✅ Tests

### Phase 3 - Sécurité (30min)
1. ✅ HttpOnly cookies (optionnel, plus sécurisé)
2. ✅ Rotation des refresh tokens
3. ✅ Révocation sur logout

## 🔐 Sécurité

- ✅ Refresh tokens stockés en DB (révocables)
- ✅ Access token court (30min)
- ✅ Refresh token long (7j)
- ✅ Rotation: nouveau refresh_token à chaque refresh
- ⚠️ HTTPS obligatoire en production

## 🚀 Migration utilisateurs existants

```javascript
// Dans AuthContext, au mount
if (hasOldTokenOnly()) {
  // Auto-login pour générer refresh token
  silentRefresh();
}
```

## ⏱️ Estimation totale
**3-4 heures** de développement + tests

---

**Note**: Cette fonctionnalité sera implémentée dans un Sprint dédié pour éviter de casser l'authentification existante.
