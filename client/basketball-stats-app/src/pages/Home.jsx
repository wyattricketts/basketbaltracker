export default function Home() {
  return (
    <div>
      <h1>Basketball Stats App</h1>
      <p>Welcome to the Basketball Stats App! Here you can input your basketball shot data and visualize your performance.</p>
      <div>
        <h2>Choose an option:</h2>
        <ul>
          <li><a href="/data-entry">Data Entry</a></li>
          <li><a href="/visualization">Visualization</a></li>
        </ul>
      </div>
    </div>
  );
}