<div class="container">
    <header>
        <nav>
        </nav>
        <h1>Countries &amp; Capitals</h1>
    </header>
    <div ng-if="isLoading">Loading</div>
    <main ng-view ng-if="!isLoading">
        
    </main>
    <footer>
        <a href="./#">Home</a>
        <a href="./#/countries">Browse Countries</a>
    </footer>
</div>