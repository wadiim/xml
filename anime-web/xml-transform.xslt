<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:aw="http://animeweb.com/xml">
	<xsl:output method="xml" version="1.0" encoding="utf-8" indent="yes" />
	
	<xsl:key name="director" match="/aw:animeWeb/directorList/director" use="@directorId" />
	
	<xsl:template match="/aw:animeWeb">
		<xsl:comment><xsl:value-of select="system-property('xsl:version')"/></xsl:comment>
		<xsl:element name="animeWebReport">
			<xsl:element name="author">
				<xsl:value-of select="concat(author/firstName, ' ', author/lastName)" />
			</xsl:element>
			<xsl:element name="reportTitle">
				<xsl:value-of select="name" />
			</xsl:element>
			<xsl:element name="animeList">
				<xsl:apply-templates select="/aw:animeWeb/animeList" />
			</xsl:element>
			<xsl:element name="summary">
				<xsl:element name="animeCount">
					<xsl:value-of select="count(animeList/anime)" />
				</xsl:element>
				<xsl:element name="directorCount">
					<xsl:value-of select="count(directorList/director)" />
				</xsl:element>
				<xsl:element name="seriesCount">
					<xsl:value-of select="count(animeList/anime/numberOfEpisodes)" />
				</xsl:element>
				<xsl:element name="movieCount">
					<xsl:value-of select="count(animeList/anime) - count(animeList/anime/numberOfEpisodes)" />
				</xsl:element>
				<xsl:element name="averageRating">
					<xsl:value-of select="sum(animeList/anime/rating) div count(animeList/anime)" />
				</xsl:element>
				<xsl:element name="reportGenerationDate">
					<!-- <xsl:value-of select="format-date(current-date(), '[D01]/[M01]/[Y0001]')" /> -->
					<xsl:text>19/11/2022</xsl:text>
				</xsl:element>
			</xsl:element>
		</xsl:element>
	</xsl:template>
	
	<xsl:template match="/aw:animeWeb/animeList">
		<xsl:for-each select="anime">
			<xsl:sort select="title" />
			<xsl:element name="anime">
				<xsl:element name="title">
					<xsl:value-of select="title" />
				</xsl:element>
				<xsl:element name="rating">
					<xsl:value-of select="rating" />
				</xsl:element>
				<xsl:element name="releaseDate">
					<xsl:value-of select="releaseDate" />
				</xsl:element>
				<xsl:element name="type">
					<xsl:choose>
						<xsl:when test="numberOfEpisodes">
							<xsl:text>Series</xsl:text>
						</xsl:when>
						<xsl:otherwise>
							<xsl:text>Movie</xsl:text>
						</xsl:otherwise>
					</xsl:choose>
				</xsl:element>
				<xsl:element name="genres">
					<xsl:for-each select="genreList/genre">
						<xsl:value-of select="@genreId" />
						<xsl:choose>
							<xsl:when test="position() != last()">
								<xsl:text>, </xsl:text>
							</xsl:when>
					  </xsl:choose>
					</xsl:for-each>
				</xsl:element>
				<xsl:element name="directors">
					<xsl:for-each select="creatorList/creator">
						<xsl:for-each select="key('director', @directorId)">
							<xsl:value-of select="concat(firstName, ' ', lastName)" />
						</xsl:for-each>
						<xsl:choose>
							<xsl:when test="position() != last()">
								<xsl:text>, </xsl:text>
							</xsl:when>
					  </xsl:choose>
					</xsl:for-each>
				</xsl:element>
			</xsl:element>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>
