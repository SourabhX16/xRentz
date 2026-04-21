import { Link } from 'react-router-dom';

export default function FavoriteList({ listings }) {
  if (listings.length === 0) {
    return (
      <div className="dashboard-empty-tab">
        <div className="dashboard-empty-tab__icon">❤️</div>
        <h3>No favorites yet</h3>
        <p>Save listings you love and they'll show up here.</p>
        <Link to="/listings" className="btn btn--primary btn--md">Browse Listings</Link>
      </div>
    );
  }

  return (
    <div className="dashboard-favorites__grid">
      {listings.map(listing => (
        <Link key={listing.id} to={`/listing/${listing.id}`} className="fav-item">
          <img src={listing.images[0]} alt={listing.title} className="fav-item__image" />
          <div className="fav-item__info">
            <h3>{listing.title}</h3>
            <p>{listing.location}</p>
            <p className="fav-item__price">${listing.price}/night</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
