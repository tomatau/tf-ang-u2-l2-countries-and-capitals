<div class="container">
    <header>
        <h1>Countries &amp; Capitals</h1>
        <nav>
            <a href="./#">Home</a>
            <a href="./#/countries">Browse Countries</a>
        </nav>
    </header>
    <div ng-if="isLoading">Loading</div>
    <main ng-view ng-if="!isLoading">
        <!-- Content Here -->
    </main>
    <footer>
        <a href="./#">Home</a>
        <a href="./#/countries">Browse Countries</a>
    </footer>
</div>